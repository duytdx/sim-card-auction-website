<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { getTime } from "@/utils/dateTimeUtils";
import { computed } from "vue";

const authStore = useAuthStore();

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const isMyMessage = computed(() => {
  return props.message.senderId === authStore.user?.id;
});
</script>

<template>
  <div :class="['message', isMyMessage ? 'sent-message' : 'received-message']">
    <!--Message Content-->
    <p>{{ message.content }}</p>

    <!--Message Metadata-->
    <div class="align-self-end d-flex align-center ga-1">
      <!--Message Time-->
      <span class="text-secondary-variant font-size-10">
        {{ getTime(message.sentAt) }}
      </span>

      <!--Is isRead-->
      <VIcon
        v-if="isMyMessage"
        icon="mdi-check-all"
        size="12"
        :color="message.isRead ? 'success' : ''"
      />
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 5px;
  border-radius: 10px;
  margin: 10px 2px;
  max-inline-size: 200px;
  overflow-wrap: break-word;
  min-width: 100px;
}

.received-message {
  background-color: #d1d1d1;
  color: rgba(33, 33, 33, 1);
  align-self: flex-end;
}

.sent-message {
  background-color: #3f51b5;
  color: white;
  align-self: flex-start;
}

.font-size-10 {
  font-size: 9px;
}
</style>
