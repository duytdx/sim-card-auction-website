<script setup>
import { ref } from "vue";

const props = defineProps({
  intialSearchTerm: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["search"]);

const searchTerm = ref(props.intialSearchTerm);

const search = () => {
  if (searchTerm.value?.trim()) {
    emit("search", { search: searchTerm.value });
  }
};
</script>

<template>
  <VTextField
    v-model="searchTerm"
    append-inner-icon="mdi-magnify"
    density="compact"
    placeholder="Search for auctions"
    variant="solo"
    class="border rounded"
    @click:append-inner="search"
    @keyup.enter="search"
    autofocus
    hide-details
    flat
  />
</template>
