<script setup>
import { computed } from "vue";

const props = defineProps({
  percentage: {
    type: Number,
  },
});

const isProcessing = computed(() => props.percentage >= 100);
</script>

<template>
  <VOverlay
    class="d-flex align-center justify-center"
    :model-value="true"
    scroll-strategy="none"
    persistent
  >
    <div class="d-flex flex-column align-center ga-1">
      <VProgressCircular
        :model-value="percentage"
        color="primary"
        size="x-large"
        :indeterminate="isProcessing"
      >
        <template v-if="!isProcessing"> {{ percentage }}% </template>
      </VProgressCircular>

      <div v-if="isProcessing" class="text-caption">Processing...</div>
      <div v-else class="text-caption">Uploading...</div>
    </div>
  </VOverlay>
</template>
