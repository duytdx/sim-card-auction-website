import httpClient from "../httpClient";

export default {
  async addReview(revieweeId, review) {
    const response = await httpClient.post(
      `/users/${revieweeId}/reviews`,
      review,
      { requiresAuth: true }
    );

    return response.data;
  },

  async fetchUserReviews(userId, page, pageSize) {
    const response = await httpClient.get(`/users/${userId}/reviews`, {
      params: { page, pageSize },
    });

    return response.data;
  },

  async fetchMyReview(revieweeId) {
    const response = await httpClient.get(
      `/users/${revieweeId}/reviews/my-review`,
      { requiresAuth: true }
    );

    return response.data;
  },

  async updateMyReview(revieweeId, review) {
    await httpClient.put(`/users/${revieweeId}/reviews/my-review`, review, {
      requiresAuth: true,
    });
  },

  async deleteMyReview(revieweeId) {
    await httpClient.delete(`/users/${revieweeId}/reviews/my-review`, {
      requiresAuth: true,
    });
  },
};
