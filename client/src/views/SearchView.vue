<script setup>
import { useDisplay } from "vuetify";
import useAuctionsManager from "@/composables/useAuctionsManager";
import SearchBar from "@/components/SearchView/SearchBar.vue";
import AuctionFiltersDialog from "@/components/Shared/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/Shared/AuctionsGrid.vue";

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
    <SearchBar
      :intial-search-term="filters.search"
      @search="changeFilters"
      class="mb-4"
    />

    <!--Search Results-->
    <section v-if="filters.search">
      <div class="d-flex align-center ga-2 mb-3">
        <VIcon icon="mdi-magnify" :size="xs ? 'small' : 'default'" />
        <h1 :class="xs ? 'text-h6' : 'text-h5'">
          <span class="font-weight-light">Results for</span> '{{
            filters.search
          }}'
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
</template>
