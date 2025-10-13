<script setup>
import notfound from "@/assets/404.png";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <VEmptyState
    headline="Whoops, 404"
    text="The page you were looking for does not exist"
    action-text="Back to home"
    :image="notfound"
    @click:action="router.replace('/')"
  />
</template>
