<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import { useChatsStore } from "@/stores/ChatsStore";
import { useChatStore } from "@/stores/ChatStore";
import { computed } from "vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

const chatStore = useChatStore();
const chatsStore = useChatsStore();

const senderProfilePicture = computed(() => {
  return props.chat?.participantProfilePictureUrl ?? defaultProfilePicture;
});

const lastMessage = computed(() => {
  return props.chat?.lastMessage?.length > 20
    ? `${props.chat.lastMessage.substring(0, 20)}...`
    : props.chat?.lastMessage ?? "";
});

const unreadMessagesCountIcon = computed(() => {
  return props.chat.unreadMessagesCount > 9
    ? "mdi-numeric-9-plus-circle"
    : `mdi-numeric-${props.chat.unreadMessagesCount}-circle`;
});

const openChat = async () => {
  try {
    await chatStore.load(props.chat);
    props.chat.hasUnseenMessages = 0;
    chatsStore.unreadChatsCount -= 1;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <VListItem @click="openChat" class="pa-2 mx-1 mb-1" rounded>
    <template #prepend>
      <VBadge
        :model-value="chat.isParticipantOnline"
        color="success"
        location="bottom right"
        offset-x="5"
        offset-y="5"
        dot
        bordered
      >
        <VAvatar :image="senderProfilePicture" size="x-large" />
      </VBadge>
    </template>

    <template #title>
      <span class="text-high-emphasis">
        {{ chat.participantName }}
      </span>
    </template>

    <template #subtitle>
      {{ lastMessage }}
    </template>

    <template #append v-if="chat.unreadMessagesCount">
      <VIcon
        :icon="unreadMessagesCountIcon"
        color="error"
        size="small"
        class="opacity-100"
      />
    </template>
  </VListItem>
</template>
