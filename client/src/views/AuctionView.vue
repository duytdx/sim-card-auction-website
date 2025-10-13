<script setup>
import AuctionDetailsCard from "@/components/AuctionView/AuctionDetailsCard.vue";
import ReviewCard from "@/components/AuctionView/ReviewCard.vue";
import WinningBidCard from "@/components/AuctionView/WinningBidCard.vue";
import { ErrorCode } from "@/api/errorCodes";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BidsCard from "@/components/AuctionView/BidsCard.vue";

const route = useRoute();
const router = useRouter();
const auctionStore = useAuctionStore();
const isFound = ref(false); // Track if auction is found

onBeforeMount(async () => {
  try {
    await auctionStore.load(route.params.id);
    isFound.value = true;
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.RESOURCE_NOT_FOUND) {
      router.replace({ name: "NotFound" });
      return;
    }
  }
});

onBeforeUnmount(() => {
  auctionStore.unload();
});
</script>

<template>
  <!-- Prevent rendering anything if auction is not found -->
  <template v-if="isFound">
    <VContainer class="d-flex justify-center flex-column h-100">
      <VProgressCircular
        v-if="auctionStore.loading"
        class="align-self-center"
        color="primary"
        size="40"
        indeterminate
      />

      <template v-else>
        <AuctionDetailsCard />

        <VScrollYTransition hide-on-leave leave-absolute>
          <BidsCard v-if="auctionStore.isActive" />
          <template v-else>
            <div>
              <WinningBidCard />
              <ReviewCard
                v-if="
                  auctionStore.amIWinner ||
                  (auctionStore.amIAuctioneer && auctionStore.hasWinner)
                "
              />
            </div>
          </template>
        </VScrollYTransition>
      </template>
    </VContainer>
  </template>
</template>
