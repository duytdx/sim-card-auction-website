<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { computed } from "vue";
import { useDisplay } from "vuetify";

const authStore = useAuthStore();
const { smAndDown } = useDisplay();

const spaceFromRight = computed(() => {
  return smAndDown.value ? "20px" : "36px";
});
</script>

<template>
  <VBtn
    v-if="authStore.isLoggedIn"
    to="/auctions/create"
    icon="mdi-plus"
    color="primary"
    :style="`z-index:999; position:fixed; bottom:40px; right:${spaceFromRight};`"
  />
</template>
