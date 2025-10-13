import { useAuthStore } from "@/stores/AuthStore";

export function objectToFormData(object) {
  const formData = new FormData();

  for (let key in object) {
    // to ignore inherited properties
    if (object.hasOwnProperty(key)) {
      const value = object[key];

      if (value === null) continue;

      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item)); // my backend expects arrays properties in this form
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
}

export function addAuthHeader(config) {
  const authStore = useAuthStore();
  const token = authStore.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
}

export function normalizeErrorResponse(error) {
  let errorResponse;

  if (error.code === "ERR_NETWORK") {
    errorResponse = {
      errorCode: "CLIENT_ERROR",
      errorMessages: ["Oops! Something went wrong!"],
    };
  } else {
    errorResponse = error.response.data;
  }

  return errorResponse;
}
