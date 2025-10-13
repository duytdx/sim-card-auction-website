<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import usersService from "@/api/services/usersService";
import UserBiddingsFiltersMenu from "./UserBiddingsFiltersMenu.vue";
import AuctionsGrid from "../Shared/AuctionsGrid.vue";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const authStore = useAuthStore();

const loading = ref(false);
const auctions = ref([]);
const page = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);
const filters = ref({ activeOnly: false });

const noAuctionsText = computed(() => {
  const amIProfileOwner = authStore.user && authStore.user?.id === props.userId;

  return amIProfileOwner
    ? "You don't have biddings."
    : "The user has no biddings.";
});

const fetchUserBiddings = async () => {
  try {
    loading.value = true;
    const { data, metadata } = await usersService.fetchUserBiddings(
      props.userId,
      page.value,
      pageSize.value,
      filters.value
    );

    auctions.value = data;
    page.value = metadata.page;
    totalPages.value = metadata.totalPages;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const changePage = async (newPage) => {
  page.value = newPage;
  await fetchUserBiddings();
};

const changeFilters = async (newFilters) => {
  page.value = 1; // Rest page when filter
  filters.value = newFilters;
  await fetchUserBiddings();
};

onBeforeMount(async () => {
  await fetchUserBiddings();
});
</script>

<template>
  <div class="d-flex justify-end mb-2">
    <UserBiddingsFiltersMenu @change-filters="changeFilters" />
  </div>
  <AuctionsGrid
    :auctions="auctions"
    :loading="loading"
    :current-page="page"
    :page-size="pageSize"
    :total-pages="totalPages"
    :no-auctions-text="noAuctionsText"
    @page-change="changePage"
    items-elevated
  />
</template>
