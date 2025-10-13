<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useDisplay } from "vuetify";
import { computed } from "vue";
import ChatsDropdown from "./ChatsDropdown.vue";
import NotificationsDropdown from "./NotificationsDropdown.vue";
import ProfileDropdown from "./ProfileDropdown.vue";
import whiteLogo from "@/assets/bidx-logo-fill-white.svg";
import blackLogo from "@/assets/bidx-logo-fill-black.svg";
import useAppTheme from "@/composables/useAppTheme";

const authStore = useAuthStore();
const appTheme = useAppTheme();
const { xs, smAndUp } = useDisplay();

const logo = computed(() => {
  return appTheme.isDark.value ? whiteLogo : blackLogo;
});
</script>

<template>
  <VAppBar class="pl-4 pl-sm-8 pr-3 pr-sm-6 pt-1" flat>
    <RouterLink to="/">
      <img :src="logo" :width="xs ? 90 : 100" height="40" />
    </RouterLink>

    <template #append>
      <VBtn
        icon="mdi-magnify"
        to="/search"
        density="comfortable"
        class="mr-1"
        :active="false"
      />

      <template v-if="authStore.loading">
        <VSkeletonLoader :type="smAndUp ? 'avatar,avatar,avatar' : ''" />
      </template>

      <template v-else-if="authStore.isLoggedIn">
        <NotificationsDropdown />
        <ChatsDropdown />
        <ProfileDropdown />
      </template>

      <template v-else>
        <VBtn
          :icon="
            appTheme.isDark.value
              ? 'mdi-weather-night'
              : 'mdi-white-balance-sunny'
          "
          @click="appTheme.toggle"
          density="comfortable"
          class="mr-3"
          :active="false"
        />

        <VBtn
          color="primary"
          variant="flat"
          :size="xs ? 'small' : 'default'"
          append-icon="mdi-login"
          text="Login"
          to="/login"
          :active="false"
        />
      </template>
    </template>
  </VAppBar>
</template>
