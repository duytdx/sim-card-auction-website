<script setup>
import NotificationItem from "./NotificationItem.vue";
import { useTemplateRef } from "vue";
import { useNotificationsStore } from "@/stores/NotificationsStore";
import { useInfiniteScroll } from "@vueuse/core";

const notificationsStore = useNotificationsStore();
const el = useTemplateRef("infinite-scroll-container");
useInfiniteScroll(el, notificationsStore.loadMoreNotifications, {
  canLoadMore: notificationsStore.hasMoreNotifications,
});

const handleMenuUpdate = (isMenuOpen) => {
  if (isMenuOpen) {
    notificationsStore.load();
  }
};
</script>

<template>
  <VMenu @update:model-value="handleMenuUpdate">
    <!--Activator-->
    <template #activator="{ props }">
      <VBadge
        :model-value="notificationsStore.hasUnreadNotifications"
        :content="notificationsStore.unreadNotificationsCount"
        class="mr-2"
        color="error"
        offset-x="5"
        offset-y="6"
      >
        <VBtn v-bind="props" icon="mdi-bell-outline" density="comfortable" />
      </VBadge>
    </template>

    <!--Content-->
    <template #default>
      <VSheet min-height="350" width="350">
        <div
          class="d-flex justify-space-between align-center pl-4 pr-2 py-2 border-b"
        >
          <div class="text-subtitle-2">Notifications</div>
          <VBtn
            @click="notificationsStore.markAllAsRead"
            :disabled="!notificationsStore.hasUnreadNotifications"
            prepend-icon="mdi-check-all"
            text="Read All"
            :color="
              notificationsStore.hasUnreadNotifications ? 'primary' : 'default'
            "
            size="small"
            variant="text"
          />
        </div>

        <!--Notifications List-->
        <div ref="infinite-scroll-container" class="h-310px overflow-y-auto">
          <VSkeletonLoader
            v-if="notificationsStore.loading"
            v-for="index in 4"
            :key="index"
            type="list-item-avatar-two-line"
          />
          <NotificationItem
            v-else
            v-for="notification in notificationsStore.notifications.data"
            :key="notification.id"
            :notification="notification"
          />
        </div>
      </VSheet>
    </template>
  </VMenu>
</template>

<style scoped>
.h-310px {
  height: 310px;
}
</style>
