<script setup>
import reviewsService from "@/api/services/reviewsService";
import { computed, onBeforeMount, ref } from "vue";
import { useDisplay } from "vuetify";
import { VSheet } from "vuetify/components";
import UserReview from "./UserReview.vue";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    required: true,
  },
});

const { smAndDown } = useDisplay();
const reviews = ref([]);
const totalReviews = ref(0);
const page = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);

const fetchUserReviews = async () => {
  try {
    const { data, metadata } = await reviewsService.fetchUserReviews(
      props.userId,
      page.value,
      pageSize.value
    );

    reviews.value = data;
    page.value = metadata.page;
    totalPages.value = metadata.totalPages;
    totalReviews.value = metadata.totalItems;
  } catch (error) {
    console.error(error);
  }
};

const averageRatingFormatted = computed(() => {
  return props.averageRating.toPrecision(2);
});

onBeforeMount(async () => {
  await fetchUserReviews();
});
</script>

<template>
  <VRow class="py-1" :dense="smAndDown">
    <!--Overall Rating-->
    <VCol cols="12" md="4">
      <VSheet
        class="d-flex flex-column justify-center align-center rounded"
        elevation="1"
        :min-height="smAndDown ? '175px' : '350px'"
      >
        <span class="text-subtitle-1">Average Rating</span>
        <span class="text-h2 font-weight-bold text-high-emphasis">
          {{ averageRatingFormatted }}
        </span>
        <VRating
          :model-value="averageRating"
          color="yellow-darken-2"
          density="compact"
          half-increments
          readonly
        />
        <span class="text-caption mt-1">
          Based on {{ totalReviews }} reviews
        </span>
      </VSheet>
    </VCol>

    <!--Reviews-->
    <VCol cols="12" md="8">
      <VSheet class="pt-4 pb-2 px-6" elevation="1" min-height="350px" rounded>
        <span class="text-subtitle-2 text-high-emphasis mb-2">Reviews</span>

        <template v-if="reviews.length">
          <UserReview
            v-for="review in reviews"
            :review="review"
            :key="review.id"
            class="mb-2"
          />
          <VPagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            @update:model-value="fetchUserReviews"
            class="mt-4"
            size="small"
          />
        </template>

        <template v-else>
          <div class="d-flex justify-center text-caption">
            The user has no reviews.
          </div>
        </template>
      </VSheet>
    </VCol>
  </VRow>
</template>
