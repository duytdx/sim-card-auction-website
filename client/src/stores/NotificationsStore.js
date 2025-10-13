import notificationsService from "@/api/services/notificationsService";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: { data: [], metadata: null },
    unreadNotificationsCount: 0,
    loading: false,
  }),

  getters: {
    hasUnreadNotifications() {
      return this.unreadNotificationsCount > 0;
    },
    hasMoreNotifications() {
      return this.notifications.metadata?.hasNext;
    },
  },

  actions: {
    async load() {
      try {
        this.loading = true;
        this.notifications = await notificationsService.fetchMyNotifications(
          1,
          10
        );
      } finally {
        this.loading = false;
      }
    },

    async loadMoreNotifications() {
      if (this.notifications.metadata?.hasNext) {
        const response = await notificationsService.fetchMyNotifications(
          ++this.notifications.metadata.page // Next page
        );

        this.notifications.data.push(...response.data);
        this.notifications.metadata = response.metadata;
        return true;
      }

      return false;
    },

    async markAllAsRead() {
      if (this.unreadNotificationsCount > 0) {
        await signalrClient.markAllNotificationsAsRead();
        this.unreadNotificationsCount = 0;
        this.notifications.data.forEach((n) => (n.isRead = true));
      }
    },

    unreadNotificationsCountUpdatedHandler(response) {
      if (response.unreadNotificationsCount != this.unreadNotificationsCount) {
        const sound = new Audio("/notification.mp3");
        sound
          .play()
          .catch((err) => console.warn("Audio playback blocked:", err));
      }

      this.unreadNotificationsCount = response.unreadNotificationsCount;
    },
  },
});
