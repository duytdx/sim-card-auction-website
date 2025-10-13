import chatsService from "@/api/services/chatsService";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chat: null,
    messages: { data: [], metadata: null },
    loading: false,
  }),

  getters: {
    chatOpened() {
      return this.chat !== null;
    },
  },

  actions: {
    async create(receiverId) {
      this.chat = await chatsService.createChat(receiverId);
      await this.load(this.chat);
    },

    async load(chat) {
      try {
        this.loading = true;
        await this.unload(); // Unload the currently opened chat if exist to stop receiving messages from it

        this.chat = chat;
        [this.messages] = await Promise.all([
          chatsService.fetchChatMessages(this.chat.id, 1, 20),
          signalrClient.joinChatRoom(this.chat.id),
        ]);

        this.messages.data.reverse(); // to make the latest message at the end

        await signalrClient.markAllMessagesAsRead(this.chat.id)
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      try {
        if (this.chat) {
          this.load(this.chat);
        }
      } catch {
        // Supress the error
      }
    },

    async unload() {
      try {
        if (this.chat?.id) {
          const chatId = this.chat.id;
          this.$reset();
          await signalrClient.leaveChatRoom(chatId);
        }
      } catch {
        // Supress the error
      }
    },

    async loadMoreMessages() {
      if (this.messages.metadata.hasNext) {
        const response = await chatsService.fetchChatMessages(
          this.chat.id,
          ++this.messages.metadata.page, // Next page
          this.messages.metadata.pageSize
        );

        response.data.reverse(); // to make the newer messages at the end
        this.messages.data.unshift(...response.data);
        this.messages.metadata = response.metadata;
        return true;
      }

      return false;
    },

    async messageReceivedHandler(message) {
      if (message.chatId === this.chat?.id) {
        this.messages.data.push(message);
        ++this.messages.metadata.pageSize; // To avoid refetching it when fetching more messages in loadMoreMessages()

        if (message.senderId === this.chat.participantId)
          await signalrClient.markMessageAsRead(message.id);
      }
    },

    allMessagesReadHandler(response) {
      const readerId = response.readerId;

      this.messages.data?.forEach((message) => {
        if (message.recipientId === readerId) {
          message.isRead = true;
        }
      });
    },

    messageReadHandler(response) {
      const messageId = response.messageId;

      const message = this.messages.data?.find(
        (message) => message.id === messageId
      );

      if (message) message.isRead = true;
    },

    UserStatusChangedHandler(status) {
      if (status.userId === this.chat?.participantId) {
        this.chat.isParticipantOnline = status.isOnline;
      }
    },
  },
});
