<script setup>
import CategoriesGrid from "@/components/HomeView/CategoriesGrid.vue";
import CreateAuctionButton from "@/components/HomeView/CreateAuctionButton.vue";
import AuctionFiltersDialog from "@/components/Shared/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/Shared/AuctionsGrid.vue";
import useAuctionsManager from "@/composables/useAuctionsManager";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();

const {
  auctions,
  loading,
  page,
  pageSize,
  totalPages,
  filters,
  changePage,
  changeFilters,
} = useAuctionsManager();
</script>

<template>
  <VContainer class="h-100">
    <CategoriesGrid />

    <!--Latest Auctions-->
    <section class="mt-6">
      <div class="d-flex align-center ga-2 mb-3">
        <VIcon icon="mdi-star-four-points" :size="xs ? 'small' : 'default'" />
        <h1 :class="xs ? 'text-h6' : 'text-h5'">
          <span class="font-weight-light">Latest</span> SIM Auctions
        </h1>
        <VSpacer />
        <AuctionFiltersDialog
          :filters="filters"
          @apply-filters="changeFilters"
        />
      </div>

      <AuctionsGrid
        :auctions="auctions"
        :loading="loading"
        :current-page="page"
        :page-size="pageSize"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </section>
  </VContainer>

  <CreateAuctionButton />
</template>
