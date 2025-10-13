<script setup>
import reviewsService from "@/api/services/reviewsService";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, ref } from "vue";

const auctionStore = useAuctionStore();

const review = ref({
  rating: 1,
  comment: "",
});

const form = ref({
  loading: false,
  btnLoading: false,
  submitted: false,
  isEditing: false,
});

const placeholder = auctionStore.amIAuctioneer
  ? "Share your experience with the winner: Did he finalize the purchase as expected?"
  : "Share your experience with the auctioneer: Did he complete the sale as expected?";

const revieweeId = auctionStore.amIAuctioneer
  ? auctionStore.auction?.winnerId
  : auctionStore.auction?.auctioneer.id;

const handleSubmit = async () => {
  try {
    form.value.btnLoading = true;

    if (form.value.isEditing) {
      await reviewsService.updateMyReview(revieweeId, review.value);
    } else {
      await reviewsService.addReview(revieweeId, review.value);
    }

    form.value.submitted = true;
    form.value.isEditing = false;
  } catch (error) {
    console.error(error);
  } finally {
    form.value.btnLoading = false;
  }
};

const editReview = () => {
  form.value.isEditing = true;
  form.value.submitted = false;
};

const deleteReview = async () => {
  try {
    form.value.btnLoading = true;
    await reviewsService.deleteMyReview(revieweeId);
    review.value.comment = "";
    review.value.rating = 1;
    form.value.submitted = false;
  } catch (error) {
    console.error(error);
  } finally {
    form.value.btnLoading = false;
  }
};

onBeforeMount(async () => {
  try {
    form.value.loading = true;
    review.value = await reviewsService.fetchMyReview(revieweeId);
    form.value.submitted = true;
  } catch (error) {
    console.error(error);
  } finally {
    form.value.loading = false;
  }
});
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="1" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Your Review</h2>

        <div v-if="form.loading" class="d-flex align-center justify-center">
          <VProgressCircular color="primary" indeterminate />
        </div>

        <VForm
          v-else
          @submit.prevent="handleSubmit"
          class="d-flex flex-column align-center"
        >
          <VRating
            v-model="review.rating"
            length="5"
            color="yellow-darken-3"
            :readonly="form.submitted"
            half-increments
            hover
          />

          <VTextarea
            v-if="!form.submitted || (form.submitted && review.comment)"
            v-model="review.comment"
            class="mt-2 w-100"
            density="compact"
            variant="outlined"
            :placeholder="placeholder"
            hide-details
            no-resize
            :disabled="form.submitted"
          />

          <!--Buttons Shows If I Reviewed-->
          <div v-if="form.submitted" class="d-flex align-self-end mt-4">
            <VBtn
              text="Delete"
              @click="deleteReview"
              :loading="form.btnLoading"
              color="error"
              size="small"
              variant="outlined"
              class="mr-1"
            />
            <VBtn
              text="Edit"
              @click="editReview"
              color="primary"
              size="small"
              variant="outlined"
              class="ml-1"
            />
          </div>

          <!--Button Shows If I didn't Reviewed or While Editing My Review-->
          <VBtn
            v-else
            :text="form.isEditing ? 'Update' : 'Submit'"
            :loading="form.btnLoading"
            type="submit"
            class="mt-4 align-self-end"
            color="primary"
            size="small"
            variant="flat"
          />
        </VForm>
      </section>
    </VSheet>
  </div>
</template>
