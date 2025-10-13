<script setup>
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { computed, ref, watch } from "vue";

const signalrStateStore = useSignalrStateStore();
const hasReconnected = ref(false);

const shouldDisplayStatusBar = computed(
  () =>
    signalrStateStore.isReconnecting ||
    signalrStateStore.isDisconnected ||
    hasReconnected.value
);

const bgColor = computed(() => {
  if (signalrStateStore.isReconnecting) return "bg-warning";
  if (signalrStateStore.isDisconnected) return "bg-error";
  if (hasReconnected.value) return "bg-primary";
  return "";
});

// Show "reconnected" message for 1 second when connection reconnected
watch(
  () => signalrStateStore.isReconnecting,
  (isReconnecting, wasReconnecting) => {
    if (wasReconnecting && signalrStateStore.isConnected) {
      hasReconnected.value = true;
      setTimeout(() => {
        hasReconnected.value = false;
      }, 3000);
    }
  }
);
</script>

<template>
  <VSystemBar
    v-if="shouldDisplayStatusBar"
    :class="`d-flex justify-center align-center ${bgColor}`"
  >
    <!-- Reconnecting -->
    <template v-if="signalrStateStore.isReconnecting">
      <div class="d-flex align-center ga-1">
        <VProgressCircular size="14" width="1" indeterminate />
        <span>Reconnecting...</span>
      </div>
    </template>

    <!-- Reconnected -->
    <template v-else-if="hasReconnected">
      <div class="d-flex align-center ga-1">
        <VIcon icon="mdi-cloud-check-variant-outline" size="14" />
        <span>Reconnected</span>
      </div>
    </template>

    <!-- Disconnected -->
    <template v-else-if="signalrStateStore.isDisconnected">
      <div class="d-flex align-center ga-1">
        <VIcon icon="mdi-cloud-off-outline" size="14" />
        <span>Disconnected - Please reload the page </span>
      </div>
    </template>
  </VSystemBar>
</template>
