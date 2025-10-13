import httpClient from "../httpClient";

export default {
  async fetchMyNotifications(page, pageSize) {
    const response = await httpClient.get(`/Notifications`, {
      requiresAuth: true,
      params: {
        page,
        pageSize,
      },
    });

    return response.data;
  },
};
