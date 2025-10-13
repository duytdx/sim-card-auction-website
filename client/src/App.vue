<script setup>
import ConnectionStateBar from "./components/Shared/ConnectionStateBar.vue";
import Navbar from "./components/Shared/Navbar.vue";
import LoadingScreen from "./components/Shared/LoadingScreen.vue";
import Footer from "./components/Shared/Footer.vue";
import signalrClient from "./api/signalrClient";
import ChatBox from "./components/Shared/ChatBox.vue";
import useAppTheme from "./composables/useAppTheme";
import { useAuthStore } from "./stores/AuthStore";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useChatStore } from "./stores/ChatStore";
import { Analytics } from "@vercel/analytics/vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";

const authStore = useAuthStore();
const chatStore = useChatStore();
const appTheme = useAppTheme();

const appInitializing = ref(true);
const appInitializationFailed = ref(false);

const initializeApp = async () => {
  try {
    appInitializing.value = true;
    appInitializationFailed.value = false;

    await authStore.refreshToken();
    await signalrClient.startConnection();
    appInitializing.value = false;
  } catch {
    appInitializationFailed.value = true;
  }
};

onBeforeMount(async () => {
  appTheme.restoreSavedTheme();

  await initializeApp();
});

onBeforeUnmount(() => {
  signalrClient.stopConnection();
});
</script>

<template>
  <Analytics />
  <SpeedInsights />
  <VApp>
    <!-- Loading screen while initializing -->
    <template v-if="appInitializing">
      <LoadingScreen :failed="appInitializationFailed" @retry="initializeApp" />
    </template>

    <!-- Main application UI -->
    <template v-else>
      <ConnectionStateBar />
      <Navbar />
      <VMain>
        <RouterView #="{ Component, route }">
          <VSlideXTransition mode="out-in" hide-on-leave leave-absolute>
            <div class="h-100" :key="route.path">
              <component :is="Component" />
            </div>
          </VSlideXTransition>
        </RouterView>
      </VMain>
      <Footer />
      <ChatBox v-if="chatStore.chatOpened" />
    </template>
  </VApp>
</template>
