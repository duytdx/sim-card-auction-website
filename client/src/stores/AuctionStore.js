import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";
import auctionsService from "@/api/services/auctionsService";
import bidsService from "@/api/services/bidsService";
import signalrClient from "@/api/signalrClient";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    bids: { data: [], metadata: null },
    acceptedBid: null,
    loading: false,
    justCreatedAuction: null, // Temporarily stores the just-created auction to optimize data loading in the load() function.
    uploadProgress: 0,
  }),

  getters: {
    isActive() {
      const timeRemaning = Date.parse(this.auction?.endTime) - Date.now();
      return timeRemaning > 0;
    },

    hasWinner() {
      return this.auction?.winnerId !== null;
    },

    amIWinner() {
      const authStore = useAuthStore();

      if (authStore.isLoggedIn) {
        const myId = authStore.user?.id;
        return this.auction?.winnerId === myId;
      }
      return false;
    },

    amIAuctioneer() {
      const authStore = useAuthStore();

      if (authStore.isLoggedIn) {
        const myId = authStore.user?.id;
        return this.auction?.auctioneer?.id === myId;
      }
      return false;
    },
  },

  actions: {
    async create(auction) {
      try {
        this.loading = true;

        this.justCreatedAuction = await auctionsService.addAuction(
          auction,
          (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        );
        return this.justCreatedAuction.id;
      } finally {
        this.uploadProgress = 0;
        this.loading = false;
      }
    },

    async load(auctionId) {
      // If navigating to the just-created auction, use it directly to skip unnecessary API calls.
      // This is useful when redirecting from 'CreateAuctionView' to 'AuctionView' after creation.
      if (this.justCreatedAuction?.id == auctionId) {
        this.auction = this.justCreatedAuction;
        this.justCreatedAuction = null; // Clear it to ensure it's not reused during normal navigation.
        await signalrClient.joinAuctionRoom(this.auction.id);
        return;
      }

      try {
        this.loading = true;
        this.auction = await auctionsService.fetchAuction(auctionId);

        if (this.isActive) {
          [this.bids] = await Promise.all([
            bidsService.fetchAuctionBids(this.auction.id),
            signalrClient.joinAuctionRoom(this.auction.id),
          ]);

          this.bids.data.reverse(); // to make the latest bid at the end
        } else if (!this.isActive && this.hasWinner) {
          this.acceptedBid = await bidsService.fetchAcceptedBid(
            this.auction.id
          );
        }
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      if (this.auction?.id) {
        try {
          await this.load(this.auction?.id);
        } catch {
          // Supress the error
        }
      }
    },

    async unload() {
      try {
        await signalrClient.leaveAuctionRoom(this.auction.id);
      } catch {
        // Supress the error
      } finally {
        this.$reset();
      }
    },

    async loadMoreBids() {
      if (this.bids.metadata?.hasNext) {
        const response = await bidsService.fetchAuctionBids(
          this.auction.id,
          ++this.bids.metadata.page, // Next page
          this.bids.metadata.pageSize
        );

        response.data.reverse(); // to make the newer bid at the end
        this.bids.data.unshift(...response.data);
        this.bids.metadata = response.metadata;
        return true;
      }

      return false;
    },

    endAuction() {
      if (this.isActive) {
        this.auction.endTime = new Date().toISOString(); // Convert it to ISO to be able to parse it in the countdown
      }
    },

    bidPlacedHandler(bid) {
      this.auction.currentPrice = bid.amount;
      this.bids.data.push(bid);
      if (this.bids.metadata) {
        ++this.bids.metadata.pageSize; // To avoid refetching it when fetching more bids in loadMoreBids()
      }
    },

    bidAcceptedHandler(bid) {
      this.acceptedBid = bid;
      this.auction.winnerId = bid.bidder.id;
      this.auction.currentPrice = bid.amount;
      this.endAuction();
    },
  },
});
