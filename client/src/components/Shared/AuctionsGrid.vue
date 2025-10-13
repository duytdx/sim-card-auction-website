<script setup>
import AuctionItem from "./AuctionItem.vue";

const props = defineProps({
  auctions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  noAuctionsText: {
    type: String,
    default: "No Auctions Found.",
  },
  itemsElevated: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["page-change"]);

const changePage = (newPage) => {
  emit("page-change", newPage);
};
</script>

<template>
  <!--Loading State-->
  <VRow v-if="loading" justify="center" dense>
    <VCol v-for="i in pageSize" :key="i" cols="12" sm="4" lg="3 " class="mb-2">
      <VSkeletonLoader
        type="image@2, heading"
        :elevation="itemsElevated ? 1 : 0"
        boilerplate
      />
    </VCol>
  </VRow>

  <!--Auctions Grid-->
  <div v-else-if="auctions.length">
    <VRow justify="center" dense>
      <VScrollYReverseTransition group leave-absolute>
        <VCol
          v-for="auction in auctions"
          :key="auction.id"
          cols="12"
          sm="4"
          lg="3"
          class="mb-2"
        >
          <AuctionItem :auction="auction" :elevated="itemsElevated" />
        </VCol>
      </VScrollYReverseTransition>
    </VRow>

    <!--Pagination-->
    <VPagination
      v-if="totalPages > 1"
      :model-value="currentPage"
      :length="totalPages"
      @update:model-value="changePage"
      class="mt-2"
      size="small"
      total-visible="1"
    />
  </div>

  <!--No Auctions-->
  <div v-else class="text-center text-caption pt-10">
    {{ noAuctionsText }}
  </div>
</template>
