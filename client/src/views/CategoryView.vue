<script setup>
import { onBeforeMount, ref } from "vue";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import categoriesService from "@/api/services/categoriesService";
import useAuctionsManager from "@/composables/useAuctionsManager";
import AuctionFiltersDialog from "@/components/Shared/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/Shared/AuctionsGrid.vue";
import { ErrorCode } from "@/api/errorCodes";

const { xs } = useDisplay();
const route = useRoute();
const router = useRouter();

const category = ref({
  name: null,
  iconUrl: null,
});

const {
  auctions,
  loading,
  page,
  pageSize,
  totalPages,
  filters,
  changePage,
  changeFilters,
} = useAuctionsManager({ fixedCategory: route.params.id });

onBeforeMount(async () => {
  try {
    category.value = await categoriesService.fetchCategory(route.params.id);
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.RESOURCE_NOT_FOUND) {
      router.replace({ name: "NotFound" });
      return;
    }
  }
});
</script>

<template>
  <VContainer>
    <VSkeletonLoader
      :loading="loading"
      type="subtitle"
      class="bg-background d-flex align-center ga-2 mb-3"
      width="250px"
    >
      <RouterLink to="/" class="text-text" replace>
        <VIcon icon="mdi-chevron-left" />
      </RouterLink>
      <img
        :src="category.iconUrl"
        width="40px"
        height="40px"
        class="bg-surface pa-1 rounded"
      />
      <h2 :class="xs ? 'text-h6' : 'text-h5'">
        {{ category.name }}
      </h2>
      <VSpacer />
      <AuctionFiltersDialog
        :filters="filters"
        :hide-category-filter="true"
        @apply-filters="changeFilters"
      />
    </VSkeletonLoader>

    <AuctionsGrid
      :auctions="auctions"
      :loading="loading"
      :current-page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @page-change="changePage"
    />
  </VContainer>
</template>
