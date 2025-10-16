<script setup>
import ErrorBox from "@/components/Shared/ErrorBox.vue";
import { durationToSeconds } from "@/utils/dateTimeUtils";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useAuctionStore } from "@/stores/AuctionStore";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useCitiesStore } from "@/stores/CitiesStore";
import ImagePicker from "./ImagePicker.vue";

const { smAndDown, mdAndUp } = useDisplay();
const router = useRouter();
const auctionStore = useAuctionStore();
const categoriesStore = useCategoriesStore();
const citiesStore = useCitiesStore();

const auction = ref({
  productImages: [],
  productName: "",
  productDescription: null,
  productCondition: null,
  durationInSeconds: null,
  startingPrice: null,
  minBidIncrement: null,
  categoryId: null,
  cityId: null,
});

const duration = ref({
  days: null,
  hours: null,
  minutes: null,
});

const form = ref({
  error: null,
  productConditions: [
    { title: "Unactivated (New)", value: "New" },
    { title: "Pre-owned (Used)", value: "Used" },
  ],
  categories: computed(() => categoriesStore.categories),
  cities: computed(() => citiesStore.cities),
});

const inputRules = {
  required: (value) => {
    return value !== null && value !== undefined && value !== ""
      ? true
      : "Required.";
  },
  minLength: (value) => {
    return value.length < 5 ? "Min length is 5 characters" : true;
  },
};

const updateProductImages = (pickedImages) => {
  auction.value.productImages = pickedImages;
};

const validateImagesCount = () => {
  const imagesCount = auction.value.productImages.length;

  if (imagesCount < 1) {
    form.value.error = {
      errorMessages: ["Upload at least one SIM image."],
    };
    return false;
  } else if (imagesCount > 10) {
    form.value.error = {
      errorMessages: ["You can upload up to 10 SIM images."],
    };
    return false;
  }

  return true;
};

const createAuction = async (event) => {
  form.value.error = null;

  // ensure that the input satisfies the rules
  const { valid } = await event;
  const validImagesCount = validateImagesCount();
  if (!valid || !validImagesCount) return;

  try {
    auction.value.durationInSeconds = durationToSeconds(duration.value);
    const auctionId = await auctionStore.create(auction.value);
    router.push(`/auctions/${auctionId}`);
  } catch (errorResponse) {
    form.value.error = errorResponse;
  }
};

onBeforeMount(async () => {
  await Promise.all([categoriesStore.load(), citiesStore.load()]);
});
</script>

<template>
  <VForm @submit.prevent="createAuction" class="w-100">
    <VSheet class="pa-4 pb-3 pa-md-8 pb-md-6" elevation="1" rounded>
      <!--Title-->
      <div class="d-flex flex-column align-center align-md-start mb-4">
        <h1 class="text-h6 text-sm-h5 text-high-emphasis font-weight-bold">
          Create SIM Auction
        </h1>
        <VDivider
          thickness="3"
          :length="smAndDown ? '6rem' : '3rem'"
          color="primary"
          opacity="0.5"
        />
      </div>

      <!--Error Box-->
      <ErrorBox v-if="form.error" :error="form.error" class="mb-3" />

      <!--Details fields-->
      <VRow justify="space-between">
        <!--SIM details fields-->
        <VCol cols="12" md="6" class="pr-md-8">
          <span class="d-block text-subtitle-2 mb-3 text-high-emphasis">
            SIM details
          </span>

          <div class="text-caption text-medium-emphasis">SIM Images</div>
          <ImagePicker
            @picked-images-changed="updateProductImages"
            class="mb-5"
          />

          <div class="text-caption text-medium-emphasis">SIM Number</div>
          <VTextField
            v-model="auction.productName"
            placeholder="e.g., 0901 888 888"
            density="comfortable"
            variant="outlined"
            class="mb-1"
            maxlength="50"
            counter
            :rules="[inputRules.required, inputRules.minLength]"
          />

          <div class="text-caption text-medium-emphasis">SIM Description</div>
          <VTextarea
            v-model="auction.productDescription"
            placeholder="e.g., carrier, activation status, bonus data"
            density="comfortable"
            variant="outlined"
            class="mb-1"
            maxlength="400"
            counter
            :rules="[inputRules.required, inputRules.minLength]"
          />

          <div class="text-caption text-medium-emphasis">SIM Condition</div>
          <VSelect
            v-model="auction.productCondition"
            :items="form.productConditions"
            item-title="title"
            item-value="value"
            placeholder="Select SIM condition"
            density="comfortable"
            variant="outlined"
            :rules="[inputRules.required]"
          />
        </VCol>

        <VDivider :vertical="mdAndUp" :class="mdAndUp ? 'my-12' : 'mx-8'" />

        <!--Auction details fields-->
        <VCol cols="12" md="6" class="pl-md-8">
          <span class="d-block text-subtitle-2 mb-3 text-high-emphasis">
            Auction details
          </span>

          <div class="text-caption text-medium-emphasis">Duration</div>
          <div class="d-flex mb-1">
            <VNumberInput
              v-model="duration.days"
              placeholder="Days"
              density="comfortable"
              variant="outlined"
              controlVariant="stacked"
              class="mr-2"
              suffix="D"
              :min="Number(0)"
              :max="Number(29)"
              :rules="[inputRules.required]"
            />
            <VNumberInput
              v-model="duration.hours"
              placeholder="Hours"
              density="comfortable"
              variant="outlined"
              controlVariant="stacked"
              class="mr-2"
              suffix="H"
              :min="Number(0)"
              :max="Number(23)"
              :rules="[inputRules.required]"
            />
            <VNumberInput
              v-model="duration.minutes"
              placeholder="Minutes"
              density="comfortable"
              variant="outlined"
              controlVariant="stacked"
              suffix="M"
              :min="Number(1)"
              :max="Number(59)"
              :rules="[inputRules.required]"
            />
          </div>

          <div class="text-caption text-medium-emphasis">Starting Price</div>
          <VNumberInput
            v-model="auction.startingPrice"
            placeholder="e.g., 500 EGP"
            density="comfortable"
            variant="outlined"
            controlVariant="stacked"
            class="mb-1"
            suffix="EGP"
            :min="Number(10)"
            :rules="[inputRules.required]"
          />

          <div class="text-caption text-medium-emphasis">
            Min. Bid Increment
          </div>
          <VNumberInput
            v-model="auction.minBidIncrement"
            placeholder="e.g., 50 EGP"
            density="comfortable"
            variant="outlined"
            controlVariant="stacked"
            class="mb-1"
            suffix="EGP"
            :min="Number(1)"
            :rules="[inputRules.required]"
          />

          <div class="text-caption text-medium-emphasis">Category</div>
          <VSelect
            v-model="auction.categoryId"
            :items="form.categories"
            item-value="id"
            item-title="name"
            placeholder="Select category"
            density="comfortable"
            variant="outlined"
            :rules="[inputRules.required]"
          />

          <div class="text-caption text-medium-emphasis">City</div>
          <VSelect
            v-model="auction.cityId"
            :items="form.cities"
            item-value="id"
            item-title="name"
            placeholder="Select city"
            density="comfortable"
            variant="outlined"
            :rules="[inputRules.required]"
          />
        </VCol>
      </VRow>

      <!--Buttons-->
      <div
        class="d-flex flex-column-reverse mt-4 flex-md-row justify-md-end mt-md-6"
      >
        <VBtn
          text="Cancel"
          @click="router.replace('/')"
          variant="outlined"
          color="secondary"
          class="mr-md-3"
          :block="smAndDown"
        />

        <VBtn
          text="Create"
          variant="flat"
          color="primary"
          type="submit"
          class="mb-2 mb-md-0"
          :block="smAndDown"
        />
      </div>
    </VSheet>
  </VForm>
</template>
