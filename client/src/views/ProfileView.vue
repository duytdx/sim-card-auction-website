<script setup>
import UserInfo from "@/components/ProfileView/UserInfo.vue";
import UserAuctionsSubview from "@/components/ProfileView/UserAuctionsSubView.vue";
import UserBiddingsSubview from "@/components/ProfileView/UserBiddingsSubview.vue";
import UserReviewsSubview from "@/components/ProfileView/UserReviewsSubview.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import usersService from "@/api/services/usersService";
import { ErrorCode } from "@/api/errorCodes";

const route = useRoute();
const router = useRouter();
const tab = ref("auctions");
const loading = ref(false);
const user = ref({});

let userId = Number(route.params.id);

const fetchUserProfile = async () => {
  try {
    loading.value = true;
    user.value = await usersService.fetchUserProfile(userId);
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.RESOURCE_NOT_FOUND) {
      router.replace({ name: "NotFound" });
      return;
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    userId = Number(newId);
    await fetchUserProfile();
  }
);

onBeforeMount(async () => {
  await fetchUserProfile();
});
</script>

<template>
  <VContainer class="pt-10 h-100">
    <template v-if="loading">
      <div class="d-flex justify-center align-center pb-10 h-100">
        <VProgressCircular color="primary" size="40" indeterminate />
      </div>
    </template>

    <template v-else>
      <!-- Profile Header -->
      <VSheet
        class="d-flex flex-column align-center mt-16 mb-4"
        elevation="1"
        rounded
      >
        <UserInfo :user="user" class="mt-n16 mb-4" />

        <VTabs v-model="tab" class="w-100" color="primary" fixed-tabs>
          <VTab value="auctions">Auctions</VTab>
          <VTab value="biddings">Biddings</VTab>
          <VTab value="reviews">Reviews</VTab>
        </VTabs>
      </VSheet>

      <!-- Profile Subviews -->
      <VTabsWindow v-model="tab">
        <VTabsWindowItem value="auctions">
          <UserAuctionsSubview :user-id="userId" />
        </VTabsWindowItem>

        <VTabsWindowItem value="biddings">
          <UserBiddingsSubview :user-id="userId" />
        </VTabsWindowItem>

        <VTabsWindowItem value="reviews">
          <UserReviewsSubview
            :user-id="userId"
            :average-rating="user.averageRating"
          />
        </VTabsWindowItem>
      </VTabsWindow>
    </template>
  </VContainer>
</template>
