<script setup>
import { useDisplay } from "vuetify";

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const { xs } = useDisplay();
</script>

<template>
  <RouterLink :to="`categories/${category.id}`" class="text-decoration-none">
    <VSheet class="d-flex flex-column align-center pa-2" rounded>
      <VImg
        :src="category.iconUrl"
        :width="xs ? '30px' : '50px'"
        :height="xs ? '30px' : '50px'"
      />
      <span class="text-caption text-high-emphasis">{{ category.name }}</span>
    </VSheet>
  </RouterLink>
</template>
