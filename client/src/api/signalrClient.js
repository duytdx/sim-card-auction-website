import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/stores/AuthStore";
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { useAuctionStore } from "@/stores/AuctionStore";
import { singalrStates } from "./signalrStates";
import { useChatStore } from "@/stores/ChatStore";
import { useChatsStore } from "@/stores/ChatsStore";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import { useNotificationsStore } from "@/stores/NotificationsStore";

let connection = null;
let isRestarting = false; // To track intentional restarts

function createConnection() {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_BIDX_SIGNALR_URL, {
      accessTokenFactory: () => useAuthStore().accessToken,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true, // Improves the performance by skipping the negotiate request and establish the WS connection directly
    })
    .configureLogging(signalR.LogLevel.Information)
    .withServerTimeout(10000) // 2X the KeepAliveInterval value configured by the server
    .withKeepAliveInterval(5000)
    .withAutomaticReconnect()
    .build();
}

function registerHandlers() {
  const signalrStateStore = useSignalrStateStore();
  const auctionStore = useAuctionStore();
  const auctionsStore = useAuctionsStore();
  const chatStore = useChatStore();
  const chatsStore = useChatsStore();
  const notificationsStore = useNotificationsStore();

  connection?.onreconnecting(() => {
    signalrStateStore.setState(singalrStates.reconnecting);
  });

  connection?.onreconnected(async () => {
    signalrStateStore.setState(singalrStates.connected);
    auctionStore.reload();
    auctionsStore.reload();
    chatStore.reload();
  });

  connection?.onclose(() => {
    // Prevent setting 'disconnected' state during an intentional restart at login/logout
    if (!isRestarting) signalrStateStore.setState(singalrStates.disconnected);
  });

  connection?.on("BidPlaced", auctionStore.bidPlacedHandler);
  connection?.on("BidAccepted", auctionStore.bidAcceptedHandler);

  connection?.on("AuctionCreated", auctionsStore.auctionCreatedHandler);
  connection?.on("AuctionDeleted", auctionsStore.auctionDeletedHandler);
  connection?.on("AuctionEnded", auctionsStore.auctionEndedHandler);
  connection?.on(
    "AuctionPriceUpdated",
    auctionsStore.auctionPriceUpdatedHandler
  );

  connection?.on("MessageReceived", chatStore.messageReceivedHandler);
  connection?.on("AllMessagesRead", chatStore.allMessagesReadHandler);
  connection?.on("MessageRead", chatStore.messageReadHandler);
  connection?.on("UserStatusChanged", chatStore.UserStatusChangedHandler);

  connection?.on(
    "UnreadChatsCountUpdated",
    chatsStore.unreadChatsCountUpdatedHandler
  );

  connection?.on(
    "UnreadNotificationsCountUpdated",
    notificationsStore.unreadNotificationsCountUpdatedHandler
  );
}

export default {
  async startConnection() {
    if (!connection) {
      createConnection();
      registerHandlers();
    }

    // Start the connection and retry on failure for a max of 5 attempts with an exponential delay
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await connection?.start();
        useSignalrStateStore().setState(singalrStates.connected);
        return;
      } catch {
        if (attempt === maxAttempts)
          throw new Error("Max attempts reached for SignalR connection");

        // Wait before retrying
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  },

  async stopConnection() {
    try {
      await connection?.stop();
    } catch {
      // Suppress the error
    }
  },

  async restartConnection() {
    isRestarting = true;

    await this.stopConnection();
    await this.startConnection();

    isRestarting = false;
  },

  // Server Functions to Invoke
  async joinAuctionRoom(auctionId) {
    await connection?.invoke("JoinAuctionRoom", { auctionId });
  },
  async leaveAuctionRoom(auctionId) {
    await connection?.invoke("LeaveAuctionRoom", { auctionId });
  },
  async placeBid(auctionId, amount) {
    await connection?.invoke("PlaceBid", { auctionId, amount });
  },
  async acceptBid(bidId) {
    await connection?.invoke("AcceptBid", { bidId });
  },

  async joinChatRoom(chatId) {
    await connection?.invoke("JoinChatRoom", { chatId });
  },
  async leaveChatRoom(chatId) {
    await connection?.invoke("LeaveChatRoom", { chatId });
  },
  async sendMessage(chatId, message) {
    await connection?.invoke("SendMessage", { chatId, message });
  },
  async markMessageAsRead(messageId) {
    await connection?.invoke("MarkMessageAsRead", { messageId });
  },
  async markAllMessagesAsRead(chatId) {
    await connection?.invoke("MarkAllMessagesAsRead", { chatId });
  },

  async markNotificationAsRead(notificationId) {
    await connection?.invoke("MarkNotificationAsRead", { notificationId });
  },
  async markAllNotificationsAsRead() {
    await connection?.invoke("MarkAllNotificationsAsRead");
  },

  async joinFeedRoom() {
    await connection?.invoke("JoinFeedRoom");
  },
  async leaveFeedRoom() {
    await connection?.invoke("LeaveFeedRoom");
  },
};
