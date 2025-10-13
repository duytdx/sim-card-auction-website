<script setup>
import VueCountdown from "@chenfengyuan/vue-countdown";
import { useAuctionStore } from "@/stores/AuctionStore";
import { computed } from "vue";

const auctionStore = useAuctionStore();

const remainingTimeInMs = computed(() => {
  return Date.parse(auctionStore.auction?.endTime) - Date.now();
});

const formatProps = (props) => {
  const formattedProps = {};
  // Add 0 prefix for all numbers less than 10
  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : `${value}`;
  });
  return formattedProps;
};
</script>

<template>
  <div>
    <!--Auction is active-->
    <VueCountdown
      v-if="auctionStore.isActive"
      :time="remainingTimeInMs"
      :transform="formatProps"
      #default="{ days, hours, minutes, seconds }"
      @end="auctionStore.endAuction()"
    >
      <div
        class="d-flex justify-center align-center ga-1 text-caption font-weight-bold"
      >
        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ days }}d
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ hours }}h
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ minutes }}m
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ seconds }}s
        </div>
      </div>
    </VueCountdown>

    <!--Auction has ended-->
    <div
      v-else
      class="d-flex flex-column justify-center align-center text-caption font-weight-medium text-error"
    >
      <VIcon icon="mdi-timer-alert" size="35" />
      <span>Auction Has Ended</span>
    </div>
  </div>
</template>
