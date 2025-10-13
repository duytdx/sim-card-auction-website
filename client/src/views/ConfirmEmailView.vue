<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const confirmationSucceed = ref(false);

onBeforeMount(async () => {
  const userId = route.query.userId;
  const token = route.query.token;

  if (!userId || !token) {
    router.replace("/");
    return;
  }

  try {
    loading.value = true;
    await authStore.confirmEmail(userId, token);
    confirmationSucceed.value = true;
  } catch (errorResponse) {
    console.error(errorResponse);
  } finally {
    loading.value = false;
    setTimeout(() => router.replace("/"), 1500);
  }
});
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VProgressCircular
      v-if="loading"
      class="align-self-center"
      color="primary"
      size="40"
      indeterminate
    />

    <VSheet
      v-else-if="confirmationSucceed"
      class="d-flex flex-column align-center justify-center flex-grow-1 min-w-300 max-w-500 h-300"
      elevation="1"
      rounded
    >
      <VIcon icon="mdi-email-check-outline" size="60" color="primary" />
      <span class="text-h6 text-high-emphasis mt-1">
        Email Confirmed Successfully
      </span>
    </VSheet>

    <VSheet
      v-else
      class="d-flex flex-column align-center justify-center flex-grow-1 min-w-300 max-w-500 h-300"
      elevation="1"
      rounded
    >
      <VIcon icon="mdi-email-remove-outline" size="60" color="error" />
      <span class="text-h6 text-high-emphasis mt-1">
        Email Confirmation Failed
      </span>
    </VSheet>
  </VContainer>
</template>

<style scoped>
.max-w-500 {
  max-width: 500px;
}

.min-w-300 {
  min-width: 300px;
}

.h-300 {
  height: 200px;
}
</style>
