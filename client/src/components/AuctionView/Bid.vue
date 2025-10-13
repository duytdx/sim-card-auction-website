<script setup>
import signalrClient from "@/api/signalrClient";
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { ref } from "vue";
import UserProfileSummary from "../Shared/UserProfileSummary.vue";

const props = defineProps({
  bid: {
    type: Object,
    required: true,
  },
  amIAuctioneer: {
    type: Boolean,
    default: false,
  },
  winning: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);

const signalrStateStore = useSignalrStateStore();

const acceptTheBid = async () => {
  try {
    loading.value = true;
    await signalrClient.acceptBid(props.bid.id);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    :class="['d-flex flex-column border rounded', { 'border-s-xl': winning }]"
  >
    <!--Bid Info-->
    <div class="d-flex justify-space-between align-center px-2 px-sm-3">
      <UserProfileSummary :profile="bid.bidder" />

      <div class="text-subtitle-2">
        {{ `${bid.amount} EGP` }}
      </div>
    </div>

    <!--Accept button-->
    <VBtn
      v-if="amIAuctioneer"
      text="Accept"
      color="primary"
      variant="flat"
      class="rounded-b"
      size="small"
      @click="acceptTheBid"
      :disabled="!signalrStateStore.isConnected"
      tile
    />
  </div>
</template>
