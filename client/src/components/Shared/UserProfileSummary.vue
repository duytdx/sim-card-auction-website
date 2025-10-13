<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
});

const getStarIcon = (position) => {
  // If the current position is less than or equal to the floor of the rating,
  // show a full star

  if (position <= Math.floor(props.profile.averageRating)) {
    return "mdi-star";
  }

  // If we're at the position right after the floor and there's a decimal,
  // show a half star
  if (
    position === Math.ceil(props.profile.averageRating) &&
    props.profile.averageRating % 1 >= 0.5
  ) {
    return "mdi-star-half-full";
  }

  // Otherwise show an empty star
  return "mdi-star-outline";
};
</script>

<template>
  <div class="my-2 d-flex align-center">
    <!--Profile Picture-->
    <div class="mr-2">
      <RouterLink :to="`/profile/${profile?.id}`">
        <VAvatar :image="profile?.profilePictureUrl ?? defaultProfilePicture" />
      </RouterLink>
    </div>

    <!--Username & Rating-->
    <div class="d-flex flex-column">
      <RouterLink
        class="text-caption text-high-emphasis font-weight-bold text-decoration-none"
        :to="`/profile/${profile?.id}`"
      >
        {{ profile?.fullName }}
      </RouterLink>
      <div class="d-flex">
        <VIcon
          v-for="n in 5"
          :icon="getStarIcon(n)"
          color="yellow-darken-3"
          size="12"
        />
      </div>
    </div>
  </div>
</template>
