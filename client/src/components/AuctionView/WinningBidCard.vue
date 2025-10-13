<script setup>
import Bid from "./Bid.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { useChatStore } from "@/stores/ChatStore";
import { ref } from "vue";

const auctionStore = useAuctionStore();
const chatStore = useChatStore();
const loading = ref(false);

const contactButtonText = auctionStore.amIAuctioneer
  ? "Contact the winner"
  : "Contact the auctioneer";

const contact = async () => {
  try {
    loading.value = true;

    const receiverId = auctionStore.amIAuctioneer
      ? auctionStore.auction.winnerId
      : auctionStore.auction.auctioneer.id;

    await chatStore.create(receiverId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="1" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Winning Bid</h2>

        <!--There is a winner-->
        <template v-if="auctionStore.hasWinner">
          <!--I am the winner-->
          <div
            v-if="auctionStore.amIWinner"
            class="d-flex flex-column align-center"
          >
            <VIcon icon="mdi-seal" color="primary" size="50" />
            <div class="text-body-2 text-center">
              Congratulations!<br />You Won The Auction!
            </div>
          </div>

          <!--Anybody else is the winner-->
          <Bid v-else :bid="auctionStore.acceptedBid" winning />

          <!--Contact Button if i am an auctioneer or a Winner-->
          <VBtn
            v-if="auctionStore.amIAuctioneer || auctionStore.amIWinner"
            @click="contact"
            :text="contactButtonText"
            :loading="loading"
            color="primary"
            variant="flat"
            size="small"
            class="mt-4"
            block
          />
        </template>

        <!--There is no Winner-->
        <div v-else class="d-flex flex-column align-center pb-5">
          <VIcon icon="mdi-emoticon-sad-outline" size="45" />
          <div class="text-caption font-weight-medium text-center">
            Nobody Won!
          </div>
        </div>
      </section>
    </VSheet>
  </div>
</template>
