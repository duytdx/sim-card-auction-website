import httpClient from "../httpClient";

export default {
  async createChat(participantId) {
    const response = await httpClient.post(
      `/chats/`,
      { participantId },
      {
        requiresAuth: true,
      }
    );

    return response.data;
  },

  async fetchMyChats(page, pageSize) {
    const response = await httpClient.get(`/chats`, {
      requiresAuth: true,
      params: {
        page,
        pageSize,
      },
    });

    return response.data;
  },

  async fetchChatMessages(chatId, page, pageSize) {
    const response = await httpClient.get(`/chats/${chatId}/messages`, {
      requiresAuth: true,
      params: {
        page,
        pageSize,
      },
    });

    return response.data;
  },
};
