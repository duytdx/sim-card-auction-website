<script setup>
import { compressImage, convertToBase64 } from "@/utils/imageUtils";
import { ref, useTemplateRef } from "vue";

const emit = defineEmits(["pickedImagesChanged"]);

const fileInput = useTemplateRef("fileInput");
const imagesToPreview = ref([]); // Base64 previews for <img> src
const imagesToEmit = []; // Images to emit to parent

const openFilePicker = () => {
  fileInput.value?.click();
};

const generateBase64Previews = async (Images) => {
  return Promise.all(Images.map((img) => convertToBase64(img)));
};

const compressImages = async (Images) => {
  return Promise.all(Images.map((img) => compressImage(img)));
};

const loadPickedImages = async (event) => {
  try {
    const pickedImages = Array.from(event.target.files);
    if (!pickedImages.length) return;

    // Preview the picked images
    const previews = await generateBase64Previews(pickedImages);
    imagesToPreview.value.push(...previews);

    // Compress the picked images
    const compressedImages = await compressImages(pickedImages);
    imagesToEmit.push(...compressedImages);

    emit("pickedImagesChanged", imagesToEmit);
  } catch (error) {
    console.error(error);
  }
};

const removeImage = (index) => {
  imagesToPreview.value.splice(index, 1);
  imagesToEmit.splice(index, 1);

  emit("pickedImagesChanged", imagesToEmit);
};
</script>

<template>
  <div>
    <div class="d-flex align-center w-100 overflow-auto">
      <!--Upload button-->
      <VBtn width="110" height="100" variant="tonal" @click="openFilePicker">
        <VIcon icon="mdi-image-plus" size="50" />
      </VBtn>

      <!--Picked Images Preview-->
      <VImg
        v-for="(img, index) in imagesToPreview"
        :src="img"
        :key="index"
        width="110"
        height="100"
        class="ml-2 position-relative"
        rounded
        inline
        cover
      >
        <!--Remove Image Button-->
        <VBtn
          size="xs"
          class="position-absolute top-0 right-0"
          @click="removeImage(index)"
          tile
        >
          <VIcon icon="mdi-close" />
        </VBtn>
      </VImg>
    </div>

    <!--hidden img input used to open img picker by clicking on the Upload button above-->
    <input
      type="file"
      accept="image/*"
      class="d-none"
      ref="fileInput"
      multiple
      @change="loadPickedImages"
    />
  </div>
</template>
