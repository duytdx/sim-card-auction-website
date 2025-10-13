<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useRoute, useRouter } from "vue-router";
import { GoogleLogin } from "vue3-google-login";

const emit = defineEmits(["error"]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// This callback will be triggered when the user selects or login to his Google account from the popup
const googleLogin = async (response) => {
  try {
    await authStore.loginWithGoogle(response.credential);
    router.replace(route.query.redirect ?? "/");
  } catch (errorResponse) {
    emitError(errorResponse);
  }
};

const emitError = (error) => {
  emit("error", error);
};
</script>

<template>
  <div class="d-flex justify-center align-center">
    <GoogleLogin :callback="googleLogin" :error="emitError" />
  </div>
</template>
