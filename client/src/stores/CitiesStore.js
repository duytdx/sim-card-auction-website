// signalrStore.js
import citiesService from "@/api/services/citiesService";
import { defineStore } from "pinia";

export const useCitiesStore = defineStore("cities", {
  state: () => ({
    cities: [],
    loading: false,
  }),

  actions: {
    async load() {
      // Return if data is already loaded or there is a fetch in progress
      if (this.cities.length || this.loading) {
        return;
      }

      try {
        this.loading = true;
        this.cities = await citiesService.fetchCities();
      } catch {
        // Supress the error
      } finally {
        this.loading = false;
      }
    },
  },
});
