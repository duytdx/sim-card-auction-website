<script setup>
import authService from "@/api/services/authService";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const router = useRouter();

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const passwordVisible = ref(false);

const error = ref(null);
const loading = ref(false);
const changed = ref(false);

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

const changePassword = async (event) => {
  error.value = null;

  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    loading.value = true;
    await authService.updateMyPassword(
      currentPassword.value,
      newPassword.value
    );
    changed.value = true;
  } catch (errorResponse) {
    error.value = errorResponse;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <VForm @submit.prevent="changePassword">
    <!--Error Box-->
    <ErrorBox v-if="error" :error="error" class="mb-3" />

    <div class="text-caption text-medium-emphasis">Old Password</div>
    <VTextField
      v-model="currentPassword"
      density="comfortable"
      variant="outlined"
      class="mb-1"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="passwordVisible = !passwordVisible"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :disabled="changed"
      :rules="[inputRules.required]"
    />

    <div class="text-caption text-medium-emphasis">Password</div>
    <VTextField
      v-model="newPassword"
      density="comfortable"
      variant="outlined"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="passwordVisible = !passwordVisible"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :disabled="changed"
      :rules="[inputRules.required, inputRules.password]"
    />

    <div class="text-caption text-medium-emphasis">Confirm Password</div>
    <VTextField
      v-model="confirmNewPassword"
      density="comfortable"
      variant="outlined"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="passwordVisible = !passwordVisible"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :disabled="changed"
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
        :prepend-icon="changed ? 'mdi-check' : ''"
        :text="changed ? 'Changed' : 'Change'"
        variant="flat"
        color="primary"
        type="submit"
        class="mb-2 mb-md-0"
        :loading="loading"
        :disabled="changed"
        :block="smAndDown"
      />
    </div>
  </VForm>
</template>
