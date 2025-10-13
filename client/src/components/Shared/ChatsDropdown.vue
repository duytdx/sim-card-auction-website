<script setup>
import ChatItem from "./ChatItem.vue";
import { useChatsStore } from "@/stores/ChatsStore";
import { useInfiniteScroll } from "@vueuse/core";
import { useTemplateRef } from "vue";

const chatsStore = useChatsStore();
const el = useTemplateRef("infinite-scroll-container");
useInfiniteScroll(el, chatsStore.loadMoreChats, {
  canLoadMore: chatsStore.hasMoreChats,
});

const handleMenuUpdate = (isMenuOpen) => {
  if (isMenuOpen) {
    chatsStore.load();
  }
};
</script>

<template>
  <VMenu @update:model-value="handleMenuUpdate">
    <!--Activator-->
    <template #activator="{ props }">
      <VBadge
        :model-value="chatsStore.hasUnreadChats"
        :content="chatsStore.unreadChatsCount"
        class="mr-4"
        color="error"
        offset-x="5"
        offset-y="6"
      >
        <VBtn v-bind="props" icon="mdi-forum-outline" density="comfortable" />
      </VBadge>
    </template>

    <!--Content-->
    <template #default>
      <VSheet min-height="350" width="350">
        <div class="pl-4 py-2 text-subtitle-2 border-b">Chats</div>

        <!--Notifications List-->
        <div ref="infinite-scroll-container" class="h-310px overflow-y-auto">
          <VSkeletonLoader
            v-if="chatsStore.loading"
            v-for="i in 4"
            type="list-item-avatar-two-line"
          />
          <ChatItem
            v-else
            v-for="chat in chatsStore.chats.data"
            :key="chat.id"
            :chat="chat"
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
