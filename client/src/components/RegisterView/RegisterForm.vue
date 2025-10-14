<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import ErrorBox from "../Shared/ErrorBox.vue";
// import ContinueWithGoogleButton from "../Shared/ContinueWithGoogleButton.vue"; // Disabled Google OAuth

const emit = defineEmits(["registerDone"]);

const authStore = useAuthStore();

const user = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const form = ref({
  error: null,
  loading: false,
  passwordVisible: false,
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
  password: (value) => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    else if (value !== user.value.password) return "Passwords don't match.";
    else return true;
  },
};

const register = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.loading = true;
    form.value.error = null;
    await authStore.register(user.value);
    emit("registerDone", user.value.email);
  } catch (errorResponse) {
    form.value.error = errorResponse;
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <VSheet
    class="px-7 pt-6 pb-4 flex-grow-1"
    elevation="2"
    max-width="400"
    rounded
  >
    <!--Title-->
    <div class="mb-3 text-high-emphasis">
      <h1 class="text-h5 font-weight-bold">Register</h1>
      <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
    </div>

    <!--Error Box-->
    <ErrorBox v-if="form.error" :error="form.error" />

    <!--Register Form-->
    <VForm @submit.prevent="register">
      <VTextField
        v-model="user.firstname"
        placeholder="First Name"
        prepend-inner-icon="mdi-account-outline"
        variant="underlined"
        :rules="[inputRules.required]"
      />

      <VTextField
        v-model="user.lastname"
        placeholder="Last Name"
        prepend-inner-icon="mdi-account-outline"
        variant="underlined"
        :rules="[inputRules.required]"
      />

      <VTextField
        v-model="user.email"
        placeholder="Email Address"
        prepend-inner-icon="mdi-email-outline"
        variant="underlined"
        :rules="[inputRules.required, inputRules.email]"
      />

      <VTextField
        v-model="user.password"
        placeholder="Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="form.passwordVisible = !form.passwordVisible"
        :append-inner-icon="form.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="form.passwordVisible ? 'text' : 'password'"
        :rules="[inputRules.required, inputRules.password]"
      />

      <VTextField
        v-model="user.confirmPassword"
        placeholder="Confirm Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="form.passwordVisible = !form.passwordVisible"
        :append-inner-icon="form.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="form.passwordVisible ? 'text' : 'password'"
        :rules="[inputRules.required, inputRules.password]"
      />

      <VBtn
        text="Register"
        class="mt-8"
        color="primary"
        size="large"
        variant="flat"
        type="submit"
        :loading="form.loading"
        block
      />
    </VForm>

    <!-- Google OAuth disabled -->
    <!-- <VDivider opacity="0.3" class="my-5">OR</VDivider>
    <ContinueWithGoogleButton @error="(error) => (form.error = error)" /> -->

    <!--Login Link-->
    <div class="text-center text-caption mt-2">
      Already have an account?
      <RouterLink class="text-primary text-decoration-none" to="/login">
        Login
      </RouterLink>
    </div>
  </VSheet>
</template>
