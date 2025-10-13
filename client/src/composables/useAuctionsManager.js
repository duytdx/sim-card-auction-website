import { useAuctionsStore } from "@/stores/AuctionsStore";
import { reactive, watch, onBeforeUnmount, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

/*
The flow as following:
    1) Components call changeFilters() or changePage()
    2) The changeFilters() or changePage() updates the query params
    3) The watcher detect the changes in the query params then sync the state and fetch the auctions
OR
    1) The user enter URL with the query params directly to browser
    2) The watcher detect the changes in the query params then sync the state and fetch the auctions
*/

/**
 * Composable for managing auctions with filtering, pagination, and query param synchronization.
 */
export default function useAuctionsManager({ fixedCategory = null } = {}) {
  const route = useRoute();
  const router = useRouter();
  const auctionsStore = useAuctionsStore();

  // State
  const page = ref(1);
  const pageSize = ref(12);
  const filters = reactive({
    activeOnly: true,
    search: null,
    productCondition: null,
    categoryId: fixedCategory || null,
    cityId: null,
  });

  // Reactive state derived from the store
  const auctions = computed(() => auctionsStore.auctions.data);
  const totalPages = computed(() => auctionsStore.totalPages);
  const loading = computed(() => auctionsStore.loading);

  // Functions
  const changePage = (newPage) => {
    router.push({
      query: {
        ...route.query,
        page: newPage,
        pageSize: pageSize.value,
      },
    });
  };

  const changeFilters = (newFilters) => {
    const query = {
      page: 1, // Reset page when filters change
      pageSize: pageSize.value,
      ...Object.fromEntries(
        Object.entries(newFilters).filter(
          ([_, value]) => value != null && value !== ""
        )
      ),
    };

    // Enforce fixed category if provided
    if (fixedCategory) {
      query.categoryId = fixedCategory;
    }

    router.push({ query });
  };

  const syncStateFromQuery = (query) => {
    page.value = Number(query.page) || 1;
    pageSize.value = Number(query.pageSize) || 12;
    filters.search = query.search || null;
    filters.activeOnly = query.activeOnly == true || query.activeOnly == null;
    filters.productCondition = query.productCondition || null;
    filters.cityId = Number(query.cityId) || null;

    // Preserve fixed category if provided
    if (!fixedCategory) {
      filters.categoryId = query.categoryId ? Number(query.categoryId) : null;
    }
  };

  // Watch for query changes and synchronize state
  watch(
    () => route.query,
    (query) => {
      syncStateFromQuery(query);
      auctionsStore.load(page.value, pageSize.value, filters);
    },
    { immediate: true }
  );

  // Cleanup on component unmount
  onBeforeUnmount(() => auctionsStore.unload());

  return {
    page,
    pageSize,
    filters,
    auctions,
    totalPages,
    loading,
    changePage,
    changeFilters,
  };
}
