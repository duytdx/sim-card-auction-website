<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import useAppTheme from "@/composables/useAppTheme";
import { useAuthStore } from "@/stores/AuthStore";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const appTheme = useAppTheme();

const profilePicture = computed(() => {
  return authStore.user.profilePictureUrl ?? defaultProfilePicture;
});

const logout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<template>
  <VMenu width="350">
    <template #activator="{ props }">
      <VAvatar v-bind:="props" :image="profilePicture" density="comfortable" />
    </template>

    <!--List of Options-->
    <VList>
      <VListItem
        :to="`/profile/${authStore.user?.id}`"
        :prepend-avatar="profilePicture"
        :title="`${authStore.user.firstName} ${authStore.user.lastName}`"
        :subtitle="authStore.user.email"
        :active="false"
        append-icon="mdi-open-in-new"
        class="py-3"
      />
      <VDivider class="mb-2" />

      <VListItem @click="appTheme.toggle">
        <v-switch
          v-model="appTheme.isDark.value"
          true-icon="mdi-weather-night"
          false-icon="mdi-white-balance-sunny"
          color="primary"
          label="Dark Mode"
          hide-spin-buttons
          hide-details
        />
      </VListItem>
      <VListItem to="/settings" prepend-icon="mdi-cog" title="Settings" />
      <VListItem @click="logout" prepend-icon="mdi-logout" title="Logout" />
    </VList>
  </VMenu>
</template>
