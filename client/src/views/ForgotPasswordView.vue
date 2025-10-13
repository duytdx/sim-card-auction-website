<script setup>
import ErrorBox from "@/components/Shared/ErrorBox.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";

const authStore = useAuthStore();

const email = ref("");
const form = ref({
  error: null,
  loading: false,
  disabled: false,
});
const inputRules = {
  required: (value) => {
    return value ? true : "Required.";
  },
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid E-mail.";
  },
};

const forgotPassword = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.loading = true;
    form.value.error = null;
    await authStore.forgotPassword(email.value);
    form.value.disabled = true;
  } catch (errorResponse) {
    form.value.error = errorResponse;
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VSheet
      class="px-7 pt-6 pb-4 flex-grow-1"
      elevation="2"
      max-width="400"
      rounded
    >
      <!--Title-->
      <div class="text-h5 mb-3 text-high-emphasis font-weight-bold">
        <h1 class="text-h5 font-weight-bold">Forgot Password ?</h1>
        <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
      </div>

      <!--Error Box-->
      <ErrorBox v-if="form.error" :error="form.error" />

      <div class="py-2">
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </div>

      <!--Forgot Password Form-->
      <VForm @submit.prevent="forgotPassword">
        <VTextField
          v-model="email"
          placeholder="Email Address"
          prepend-inner-icon="mdi-email-outline"
          variant="underlined"
          :rules="[inputRules.required, inputRules.email]"
        />

        <VBtn
          :text="form.disabled ? 'Done' : 'Send'"
          class="mt-8 mb-6"
          color="primary"
          size="large"
          variant="flat"
          type="submit"
          :loading="form.loading"
          :disabled="form.disabled"
          block
        />
      </VForm>

      <!--Register Link-->
      <div class="text-center text-caption">
        Don't have an account?
        <RouterLink class="text-primary text-decoration-none" to="/register">
          Register
        </RouterLink>
      </div>
    </VSheet>
  </VContainer>
</template>
