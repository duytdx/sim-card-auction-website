<script setup>
import LoginForm from "@/components/LoginView/LoginForm.vue";
import VerifyEmailCard from "@/components/Shared/VerifyEmailCard.vue";
import { ref } from "vue";

const emailNotConfirmed = ref(false);
const emailToConfirm = ref("");

const showVerifyEmailCard = (email) => {
  emailToConfirm.value = email;
  emailNotConfirmed.value = true;
};
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VerifyEmailCard v-if="emailNotConfirmed" :email="emailToConfirm" />
    <LoginForm v-else @email-not-confirmed="showVerifyEmailCard" />
  </VContainer>
</template>
