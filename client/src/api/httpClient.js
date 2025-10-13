import { useAuthStore } from "@/stores/AuthStore";
import { addAuthHeader, normalizeErrorResponse } from "@/utils/apiUtils";
import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BIDX_API_URL,
});

// Optionally add the Authorization header based on whether the request requires authentication
httpClient.interceptors.request.use(
  (config) => {
    const requiresAuth = config.requiresAuth; // Custom property to indicate if auth is required
    if (requiresAuth) addAuthHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh the access token if the response is faild with 401 code and retry the request only once
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.config.requiresAuth && // To exclude /refresh endpoint because it shouldn't be retried because this will result into infinite loop
      !error.config.__isRetryRequest
    ) {
      const authStore = useAuthStore();
      const tokenRefreshed = await authStore.refreshToken();

      if (tokenRefreshed) {
        addAuthHeader(error.config);
        error.config.__isRetryRequest = true; // Mark the request as a retry to avoid infinite loops
        return httpClient(error.config); // Retry the original request with new access token
      }
    }

    return Promise.reject(normalizeErrorResponse(error));
  }
);

export default httpClient;
