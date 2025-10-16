<script setup>
import { useAuctionsStore } from "@/stores/AuctionsStore";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { computed } from "vue";
import { resolveFileUrl } from "@/utils/urlUtils";

const props = defineProps({
  auction: {
    type: Object,
    required: true,
  },
  elevated: {
    type: Boolean,
    default: false,
  },
});

const auctionsStore = useAuctionsStore();

const remainingTimeInMs = computed(() => {
  return Date.parse(props.auction?.endTime) - Date.now();
});

const isAuctionActive = computed(() => {
  return remainingTimeInMs.value > 0;
});

const thumbnailSrc = computed(() => {
  return resolveFileUrl(props.auction?.thumbnailUrl);
});

const onAuctionEnded = () => {
  const auctionEnded = {
    auctionId: props.auction.id,
    finalPrice: props.auction.currentPrice,
  }; // it expect this object structure as an argument

  auctionsStore.auctionEndedHandler(auctionEnded); //
};

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
  <RouterLink :to="`/auctions/${auction.id}`" class="text-decoration-none">
    <VSheet
      class="d-flex flex-column justify-space-between overflow-hidden"
      border
      rounded
      :elevation="elevated ? 1 : 0"
    >
      <!--Thumbnail-->
      <VImg
        :src="thumbnailSrc"
        alt="SIM image"
        aspect-ratio="1"
        color="#f0f0f0"
        cover
      />

      <!--Details-->
      <div class="pa-3 pt-2">
        <!--Product Name-->
        <div
          class="text-subtitle-1 text-high-emphasis font-weight-bold text-capitalize text-truncate"
        >
          {{ auction.productName }}
        </div>

        <div class="d-flex justify-space-between align-center mt-1">
          <!--Status-->
          <div v-if="isAuctionActive" class="d-flex flex-column">
            <VueCountdown
              class="text-caption text-high-emphasis font-weight-medium"
              :time="remainingTimeInMs"
              :transform="formatProps"
              @end="onAuctionEnded"
              #default="{ days, hours, minutes, seconds }"
            >
              {{ days }}d : {{ hours }}h : {{ minutes }}m : {{ seconds }}s
            </VueCountdown>
            <span class="text-caption">Remaining Time</span>
          </div>
          <div v-else class="text-caption font-weight-medium">
            <span
              v-if="auction.isUserWon"
              class="bg-success py-1 px-2 rounded letter-spacing-2"
            >
              WON
            </span>
            <span
              v-else-if="auction.isUserWon === false"
              class="bg-error py-1 px-2 rounded letter-spacing-2"
            >
              LOST
            </span>
            <span v-else class="text-error letter-spacing-2"> ENDED </span>
          </div>

          <!--Current Price-->
          <div class="d-flex flex-column align-end">
            <div class="text-body-2 text-high-emphasis font-weight-bold">
              <VSlideYTransition leave-absolute>
                <span :key="auction.currentPrice">
                  {{ auction.currentPrice }}
                </span>
              </VSlideYTransition>
              EGP
            </div>
            <span class="text-caption">
              {{ isAuctionActive ? "Current Price" : "Final Price" }}
            </span>
          </div>
        </div>
      </div>
    </VSheet>
  </RouterLink>
</template>

<style scoped>
.letter-spacing-2 {
  letter-spacing: 2px;
}
</style>
