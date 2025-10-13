<script setup>
import { ref } from "vue";

const emit = defineEmits(["change-filters"]);

const filters = ref({
  activeOnly: false,
});

const changeFilters = (selected) => {
  if (selected[0] === "All") {
    filters.value.activeOnly = false;
  } else {
    filters.value.activeOnly = true;
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
    </VList>
  </VMenu>
</template>
