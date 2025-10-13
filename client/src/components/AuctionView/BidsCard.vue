<script setup>
import signalrClient from "@/api/signalrClient";
import { useAuctionStore } from "@/stores/AuctionStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { computed, nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay, useGoTo } from "vuetify";
import Bid from "./Bid.vue";

const { smAndDown } = useDisplay();
const router = useRouter();
const goTo = useGoTo();
const authStore = useAuthStore();
const auctionStore = useAuctionStore();
const signalrStateStore = useSignalrStateStore();

const form = ref({
  bidAmount:
    auctionStore.auction?.currentPrice + auctionStore.auction?.minBidIncrement,
  loading: false,
});

const minBidAmountAllowed = computed(() => {
  return (
    auctionStore.auction?.currentPrice + auctionStore.auction?.minBidIncrement
  );
});

// Scroll to the bottom of the bids list when a new bid placed
watch(
  () => auctionStore.auction.currentPrice, // when currentPrice changes this means a new bid is placed so we can watch it instead
  async (newValue, oldValue) => {
    await nextTick(); // Ensure DOM updates first and last bid is already added
    goTo("#last-bid", { container: "#bids-list", duration: 300 });
  }
);

const loadMoreBids = async ({ done }) => {
  try {
    const isLoaded = await auctionStore.loadMoreBids();
    done(isLoaded ? "ok" : "empty");
  } catch {
    done("error");
  }
};

const placeBid = async (event) => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.loading = true;
    await signalrClient.placeBid(auctionStore.auction.id, form.value.bidAmount);
    form.value.bidAmount = minBidAmountAllowed.value;
  } catch (error) {
    console.error(error);
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <div
    :class="[
      'd-flex mt-4 justify-md-end',
      { 'mb-12 mb-md-0': !auctionStore.amIAuctioneer }, // To leave a space for the fixed PLACE-BID button in small screens
    ]"
  >
    <VSheet class="w-100 w-md-50 pa-5" elevation="1" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Bids</h2>

        <!--Bids List-->
        <VInfiniteScroll
          id="bids-list"
          :height="auctionStore.amIAuctioneer ? 210 : 215"
          side="start"
          @load="loadMoreBids"
        >
          <template v-for="(bid, idx) in auctionStore.bids.data" :key="bid.id">
            <Bid
              :id="idx === auctionStore.bids.data.length - 1 ? 'last-bid' : ''"
              :bid="bid"
              :am-i-auctioneer="auctionStore.amIAuctioneer"
              class="mb-2"
            />
          </template>

          <template #empty>
            <span
              v-if="auctionStore.bids.data.length === 0"
              class="text-caption"
            >
              No Bids Placed Yet
            </span>
          </template>
        </VInfiniteScroll>

        <!--Place Bid Form-->
        <VForm
          v-if="!auctionStore.amIAuctioneer"
          @submit.prevent="placeBid"
          :class="{
            'position-fixed bottom-0 right-0 left-0 elevation-4': smAndDown,
          }"
          style="z-index: 9999"
        >
          <VNumberInput
            v-model="form.bidAmount"
            control-variant="split"
            density="comfortable"
            variant="outlined"
            suffix="EGP"
            base-color="secondary"
            color="secondary"
            bg-color="surface"
            style="margin-bottom: -3px"
            :min="minBidAmountAllowed"
            :step="auctionStore.auction?.minBidIncrement"
            :rules="[(value) => (value >= minBidAmountAllowed ? true : false)]"
            :tile="smAndDown"
            :readonly="!signalrStateStore.isConnected"
            hide-details
            inset
          />

          <VBtn
            text="Place a Bid"
            color="primary"
            size="large"
            variant="flat"
            type="submit"
            class="rounded-b"
            :loading="form.loading"
            :disabled="!signalrStateStore.isConnected"
            block
            tile
          />
        </VForm>
      </section>
    </VSheet>
  </div>
</template>
