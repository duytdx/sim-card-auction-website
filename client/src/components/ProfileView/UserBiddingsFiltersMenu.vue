<script setup>
import { ref } from "vue";

const emit = defineEmits(["change-filters"]);

const filters = ref({
  activeOnly: false,
  wonOnly: null,
});

const changeFilters = (selected) => {
  if (selected[0] === "All") {
    filters.value.activeOnly = false;
    filters.value.wonOnly = null;
  } else if (selected[0] === "Active") {
    filters.value.activeOnly = true;
    filters.value.wonOnly = null;
  } else {
    filters.value.wonOnly = true;
    filters.value.activeOnly = null;
  }

  emit("change-filters", filters.value);
};
</script>

<template>
  <VMenu>
    <template v-slot:activator="{ props }">
      <VBtn
        prepend-icon="mdi-filter"
        text="Filter"
        color="primary"
        size="small"
        v-bind="props"
      />
    </template>

    <VList @update:selected="changeFilters">
      <VListItem
        value="All"
        density="compact"
        :disabled="filters.activeOnly === false"
      >
        <VListItemTitle>All</VListItemTitle>
      </VListItem>

      <VListItem
        value="Active"
        density="compact"
        :disabled="filters.activeOnly === true"
      >
        <VListItemTitle>Active</VListItemTitle>
      </VListItem>

      <VListItem
        value="Won"
        density="compact"
        :disabled="filters.wonOnly === true"
      >
        <VListItemTitle>Won</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
