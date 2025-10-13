// signalrStore.js
import { singalrStates } from "@/api/signalrStates";
import { defineStore } from "pinia";

export const useSignalrStateStore = defineStore("signalrState", {
  state: () => ({
    connectionState: singalrStates.disconnected,
  }),

  getters: {
    isConnected() {
      return this.connectionState === singalrStates.connected;
    },

    isReconnecting() {
      return this.connectionState === singalrStates.reconnecting;
    },

    isDisconnected() {
      return this.connectionState === singalrStates.disconnected;
    },
  },

  actions: {
    setState(currentState) {
      this.connectionState = currentState;
    },
  },
});
