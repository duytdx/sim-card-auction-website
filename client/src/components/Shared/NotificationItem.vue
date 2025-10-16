<script setup>
import signalrClient from "@/api/signalrClient";
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import { useNotificationsStore } from "@/stores/NotificationsStore";
import { getDateDifference } from "@/utils/dateTimeUtils";
import { formatBold } from "@/utils/stringUtils";
import { resolveFileUrl } from "@/utils/urlUtils";
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const notificationsStore = useNotificationsStore();

const notificationThumbnail = computed(() => {
  const resolvedUrl = resolveFileUrl(props.notification?.thumbnailUrl);
  return resolvedUrl || defaultProfilePicture;
});

const notificationMessage = computed(() => {
  return props.notification?.message.length > 90
    ? `${formatBold(props.notification.message).substring(0, 90)}...`
    : formatBold(props.notification?.message);
});

const openNotification = async () => {
  try {
    switch (props.notification.redirectTo) {
      case "AuctionPage":
        router.push(`/auctions/${props.notification.redirectId}`);
        break;
      default:
        router.replace("/");
    }

    if (!props.notification.isRead) {
      await signalrClient.markNotificationAsRead(props.notification.id);
      props.notification.isRead = true;
      notificationsStore.unreadNotificationsCount -= 1;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <VListItem @click="openNotification" class="pa-2 mx-1 mb-1" rounded>
    <template #prepend>
      <VAvatar :image="notificationThumbnail" size="x-large" />
    </template>

    <template #default>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <p
            v-html="notificationMessage"
            :class="`text-13 ${
              !notification.isRead ? 'text-high-emphasis' : ''
            }`"
          ></p>
          <VIcon
            v-if="!notification.isRead"
            icon="mdi-circle-medium"
            color="primary"
            class="opacity-100"
          />
        </div>
        <span
          :class="`text-caption  ${
            !notification.isRead
              ? 'text-high-emphasis font-weight-medium text-primary'
              : ''
          }`"
          >{{ getDateDifference(notification.createdAt) }}</span
        >
      </div>
    </template>
  </VListItem>
</template>

<style scoped>
.text-13 {
  font-size: 13px;
}
</style>
