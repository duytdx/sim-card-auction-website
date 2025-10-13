<script setup>
import whiteLogo from "@/assets/bidx-logo-fill-white.svg";
import blackLogo from "@/assets/bidx-logo-fill-black.svg";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { computed } from "vue";
import useAppTheme from "@/composables/useAppTheme";

defineProps({
  failed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["retry"]);

const appTheme = useAppTheme();

const logo = computed(() => {
  return appTheme.isDark.value ? whiteLogo : blackLogo;
});

const loaderColor = computed(() => {
  return appTheme.isDark.value ? "white" : "black";
});

const retryInitialization = () => {
  emit("retry");
};
</script>

<template>
  <div class="d-flex flex-column justify-center align-center h-100 pb-20">
    <template v-if="failed">
      <VBtn
        icon="mdi-reload"
        variant="text"
        size="x-large"
        density="comfortable"
        @click="retryInitialization"
      />
      <div class="text-caption">Connection failed, try again</div>
    </template>

    <template v-else>
      <img :src="logo" :width="120" alt="logo" draggable="false" />
      <PulseLoader :color="loaderColor" size="8px" />
    </template>
  </div>
</template>
