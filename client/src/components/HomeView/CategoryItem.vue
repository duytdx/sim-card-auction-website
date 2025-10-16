<script setup>
import { useDisplay } from "vuetify";
import { computed } from "vue";
import { resolveFileUrl } from "@/utils/urlUtils";

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const { xs } = useDisplay();

const iconSrc = computed(() => resolveFileUrl(props.category?.iconUrl));
</script>

<template>
  <RouterLink :to="`categories/${category.id}`" class="text-decoration-none">
    <VSheet class="d-flex flex-column align-center pa-2" rounded>
      <VImg
        :src="iconSrc"
        :width="xs ? '30px' : '50px'"
        :height="xs ? '30px' : '50px'"
      />
      <span class="text-caption text-high-emphasis">{{ category.name }}</span>
    </VSheet>
  </RouterLink>
</template>
