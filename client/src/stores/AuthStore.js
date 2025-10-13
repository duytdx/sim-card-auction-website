import authService from "@/api/services/authService";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";
import { watch } from "vue";
import { useChatStore } from "./ChatStore";
import { useChatsStore } from "./ChatsStore";
import { useNotificationsStore } from "./NotificationsStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
    ready: false,
  }),

  getters: {
    isLoggedIn() {
      return this.user !== null;
    },
  },

  actions: {
    async waitUntilReady() {
      if (this.ready) {
        return; // If already ready, resolve immediately
      }
      await new Promise((resolve) => {
        const unwatch = watch(
          () => this.ready,
          (ready) => {
            if (ready) {
              unwatch(); // Stop watching once the condition is met
              resolve();
            }
          }
        );
      });
    },

    async login(email, password) {
      const { user, accessToken } = await authService.login(email, password);
      localStorage.setItem("hasLoggedIn", true); // Needed for deciding to refresh or not in refreshToken()

      this.accessToken = accessToken; // Must be set here because restartConnection() depends on it
      await signalrClient.restartConnection();
      this.user = user; // Must be set here to avoid showing the profile picture in the navbar before restarting the connection
    },

    async loginWithGoogle(idToken) {
      const { user, accessToken } = await authService.loginWithGoogle(idToken);
      localStorage.setItem("hasLoggedIn", true);

      this.accessToken = accessToken; // Must be set here because restartConnection() depends on it
      await signalrClient.restartConnection();
      this.user = user; // Must be set here to avoid showing the profile picture in the navbar before restarting the connection
    },

    async register(user) {
      await authService.register(user);
    },

    async resendConfirmationEmail(email) {
      await authService.resendConfirmationEmail(email);
    },

    async confirmEmail(userId, token) {
      const { user, accessToken } =  await authService.confirmEmail(userId, token)
      localStorage.setItem("hasLoggedIn", true); // Needed for deciding to refresh or not in refreshToken()

      this.accessToken = accessToken; // Must be set here because restartConnection() depends on it
      await signalrClient.restartConnection();
      this.user = user; // Must be set here to avoid showing the profile picture in the navbar before restarting the connection
    },

    async forgotPassword(email) {
      await authService.forgotPassword(email);
    },

    async refreshToken() {
      if (!localStorage.getItem("hasLoggedIn")) {
        this.ready = true;
        return false;
      }

      try {
        this.loading = true;

        const { user, accessToken } = await authService.refreshToken();
        this.user = user;
        this.accessToken = accessToken;

        return true; // Needed for deciding to retry failed requests or not in axios response interceptor
      } catch {
        this.user = null;
        this.accessToken = null;
        localStorage.removeItem("hasLoggedIn");
        return false;
      } finally {
        this.ready = true;
        this.loading = false;
      }
    },

    async logout() {
      try {
        this.loading = true;
        this.accessToken = null; // Must be setted here because restartConnection() depends on it

        await Promise.all([
          authService.logout(),
          signalrClient.restartConnection(),
        ]);
      } catch {
        // Suppress the error
      } finally {
        localStorage.removeItem("hasLoggedIn");
        useChatStore().$reset(); // To close the opened chat box
        useChatsStore().$reset(); // To clear the unread chats count
        useNotificationsStore().$reset(); // To clear the unread notifications count
        this.user = null; // Must be setted here to avoid flashy DOM changes in the current page just before redirecting to the home page
        this.loading = false;
      }
    },
  },
});
