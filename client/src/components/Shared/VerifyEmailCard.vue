<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import ErrorBox from "./ErrorBox.vue";
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps(["email"]);

const authStore = useAuthStore();
const form = ref({
  error: null,
  loading: false,
  disabled: false,
});

const resendConfirmationEmail = async () => {
  try {
    form.value.loading = true;
    form.value.error = null;

    await authStore.resendConfirmationEmail(props.email);

    form.value.disabled = true;
  } catch (errorResponse) {
    form.value.error = errorResponse;
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <VSheet class="px-10 py-6 text-center" elevation="2" max-width="500" rounded>
    <!--Error Box-->
    <ErrorBox v-if="form.error" :error="form.error" centered="true" />

    <!--Title-->
    <VIcon icon="mdi-email-check-outline" size="100" color="primary" />
    <h1 class="d-block text-h5 mb-3 text-high-emphasis font-weight-bold">
      Verify your email
    </h1>

    <!--Paragraph-->
    We've sent an email to
    <span class="text-high-emphasis">{{ email }}</span>
    to verify your email address and activate your account. The link in the
    email will expire in 24 hours.

    <!--Resend Button-->
    <VBtn
      @click="resendConfirmationEmail"
      variant="tonal"
      color="primary"
      size="small"
      class="mt-5"
      :disabled="form.disabled"
      :loading="form.loading"
      block
    >
      <VueCountdown
        v-if="form.disabled"
        :time="120000"
        @end="form.disabled = false"
        #default="{ totalSeconds }"
      >
        Resend again in {{ totalSeconds }}s
      </VueCountdown>

      <span v-else>Resend</span>
    </VBtn>

    <span class="d-block mt-1 text-caption">
      Didn't get an email? click the button above
    </span>
  </VSheet>
</template>
