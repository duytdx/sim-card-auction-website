<script setup>
import authService from "@/api/services/authService";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const route = useRoute();
const router = useRouter();

const userId = route.query.userId;
const token = route.query.token;

const newPassword = ref("");
const confirmNewPassword = ref("");
const passwordVisible = ref(false);

const error = ref(null);
const loading = ref(false);

const inputRules = {
  required: (value) => {
    return value !== null && value !== undefined && value !== ""
      ? true
      : "Required.";
  },
  password: (value) => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    else if (value !== newPassword.value) return "Passwords don't match.";
    else return true;
  },
};

const resetPassword = async (event) => {
  error.value = null;

  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    loading.value = true;
    await authService.resetPassword(userId, token, newPassword.value);
    await router.replace("/login");
  } catch (errorResponse) {
    error.value = errorResponse;
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  if (!userId || !token) {
    router.replace("/");
    return;
  }
});
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
      <div class="mb-3 text-high-emphasis">
        <h1 class="text-h5 font-weight-bold">Reset Password</h1>
        <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
      </div>

      <VForm @submit.prevent="resetPassword">
        <!--Error Box-->
        <ErrorBox v-if="error" :error="error" class="mb-3" />

        <div class="text-caption text-medium-emphasis">New Password</div>
        <VTextField
          v-model="newPassword"
          density="comfortable"
          variant="outlined"
          :type="passwordVisible ? 'text' : 'password'"
          @click:append-inner="passwordVisible = !passwordVisible"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[inputRules.required, inputRules.password]"
        />

        <div class="text-caption text-medium-emphasis">
          Confirm New Password
        </div>
        <VTextField
          v-model="confirmNewPassword"
          density="comfortable"
          variant="outlined"
          :type="passwordVisible ? 'text' : 'password'"
          @click:append-inner="passwordVisible = !passwordVisible"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[inputRules.required, inputRules.password]"
        />

        <!--Buttons-->
        <div
          class="d-flex flex-column-reverse mt-4 flex-md-row justify-md-end mt-md-6"
        >
          <VBtn
            text="Cancel"
            @click="router.replace('/')"
            variant="outlined"
            color="secondary"
            class="mr-md-3"
            :block="smAndDown"
          />

          <VBtn
            text="Reset"
            variant="flat"
            color="primary"
            type="submit"
            class="mb-2 mb-md-0"
            :loading="loading"
            :block="smAndDown"
          />
        </div>
      </VForm>
    </VSheet>
  </VContainer>
</template>
