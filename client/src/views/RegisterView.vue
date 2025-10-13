<script setup>
import RegisterForm from "@/components/RegisterView/RegisterForm.vue";
import VerifyEmailCard from "@/components/Shared/VerifyEmailCard.vue";
import { ref } from "vue";

const registerDone = ref(false);
const emailToConfirm = ref("");

const showVerifyEmailCard = (email) => {
  emailToConfirm.value = email;
  registerDone.value = true;
};
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VerifyEmailCard v-if="registerDone" :email="emailToConfirm" />
    <RegisterForm v-else @register-done="showVerifyEmailCard" />
  </VContainer>
</template>
