<script setup>
import usersService from "@/api/services/usersService";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const authStore = useAuthStore();
const router = useRouter();

const error = ref(null);
const loading = ref(false);
const changed = ref(false);

const inputRules = {
  required: (value) => {
    return value !== null && value !== undefined && value !== ""
      ? true
      : "Required.";
  },
  minLength: (value) => {
    return value.length < 3 ? "Min length is 3 characters" : true;
  },
};

const changeProfileName = async (event) => {
  error.value = null;

  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    loading.value = true;
    await usersService.updateMyProfileName(
      authStore.user.firstName,
      authStore.user.lastName
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
  <VForm @submit.prevent="changeProfileName">
    <!--Error Box-->
    <ErrorBox v-if="error" :error="error" class="mb-3" />

    <div class="text-caption text-medium-emphasis">First Name</div>
    <VTextField
      v-model="authStore.user.firstName"
      density="comfortable"
      variant="outlined"
      class="mb-1"
      :disabled="changed"
      :rules="[inputRules.required, inputRules.minLength]"
    />

    <div class="text-caption text-medium-emphasis">Last Name</div>
    <VTextField
      v-model="authStore.user.lastName"
      density="comfortable"
      variant="outlined"
      :disabled="changed"
      :rules="[inputRules.required, inputRules.minLength]"
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
