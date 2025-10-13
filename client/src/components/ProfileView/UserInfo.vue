<script setup>
import usersService from "@/api/services/usersService";
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import { useAuthStore } from "@/stores/AuthStore";
import { compressImage } from "@/utils/imageUtils";
import { computed, ref, useTemplateRef } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const fileInput = useTemplateRef("fileInput");
const user = ref(props.user);
const loading = ref(false);

const amIProfileOwner = computed(() => authStore.user?.id === user.value.id);

const openFilePicker = () => {
  fileInput.value?.click();
};

const updateProfilePicture = async (event) => {
  try {
    loading.value = true;
    const pickedImage = event.target.files[0];

    const compressedImage = await compressImage(pickedImage);

    const { profilePictureUrl } = await usersService.updateMyProfilePicture(
      compressedImage
    );

    user.value.profilePictureUrl = profilePictureUrl;
    authStore.user.profilePictureUrl = profilePictureUrl;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="d-flex flex-column align-center">
    <div class="position-relative">
      <VImg
        :src="user.profilePictureUrl ?? defaultProfilePicture"
        class="border-md rounded-circle"
        width="130px"
        height="130px"
        alt="Profile Picture"
      />
      <VBtn
        v-if="amIProfileOwner"
        class="position-absolute right-2 bottom-2 text-high-emphasis"
        icon="mdi-camera"
        density="comfortable"
        variant="flat"
        size="small"
        @click="openFilePicker"
        :loading="loading"
        border
      />

      <!--hidden img input used to open img picker by clicking on the Upload button above-->
      <input
        type="file"
        accept="image/*"
        class="d-none"
        ref="fileInput"
        @change="updateProfilePicture"
      />
    </div>

    <h1 class="text-h5 font-weight-medium text-high-emphasis mt-2">
      {{ user.firstName }} {{ user.lastName }}
    </h1>
    <VRating
      :model-value="user.averageRating"
      density="compact"
      size="small"
      color="yellow-darken-3"
      half-increments
      readonly
    />
  </section>
</template>

<style scoped>
.bottom-2 {
  bottom: 8px;
}
.right-2 {
  right: 8px;
}
</style>
