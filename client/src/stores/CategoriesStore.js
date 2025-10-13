// signalrStore.js
import categoriesService from "@/api/services/categoriesService";
import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
    loading: false,
  }),

  actions: {
    async load() {
      // Return if data is already loaded or there is a fetch in progress
      if (this.categories.length > 0 || this.loading) {
        return;
      }

      try {
        this.loading = true;
        this.categories = await categoriesService.fetchCategories();
      } catch {
        // Supress the error
      } finally {
        this.loading = false;
      }
    },
  },
});
