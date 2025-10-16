<script setup>
import UserProfileSummary from "@/components/Shared/UserProfileSummary.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { formatDate } from "@/utils/dateTimeUtils";
import { useDisplay } from "vuetify";
import AuctionCountdown from "./AuctionCountdown.vue";
import { computed } from "vue";
import { resolveFileUrl } from "@/utils/urlUtils";

const { smAndDown, xs } = useDisplay();
const auctionStore = useAuctionStore();

const simImages = computed(() => {
  const images = auctionStore.auction?.productImages ?? [];
  return images.map((image) => resolveFileUrl(image));
});
</script>

<template>
  <VSheet class="w-100" elevation="1" rounded>
    <VRow no-gutters>
      <!--Auction Images-->
      <VCol cols="12" md="6">
        <VCarousel
          show-arrows="hover"
          :height="xs ? 300 : 600"
          :class="['rounded', smAndDown ? 'rounded-b-0' : 'rounded-e-0']"
          hide-delimiter-background
          cycle
        >
          <VCarouselItem
            v-for="(image, i) in simImages"
            :key="i"
            :src="image"
          />
        </VCarousel>
      </VCol>

      <!--Auction Details-->
      <VCol cols="12" md="6" class="pa-5 overflow-hidden">
        <section>
          <h1 class="text-h6 text-sm-h5 text-high-emphasis">
            {{ auctionStore.auction?.productName }}
          </h1>

          <!--Creator & CurrentPrice-->
          <section class="d-flex justify-space-between align-center mt-2">
            <UserProfileSummary :profile="auctionStore.auction?.auctioneer" />
            <div
              class="px-2 py-1 rounded border bg-primary text-caption font-weight-bold"
            >
              <VScrollYTransition leave-absolute>
                <span :key="auctionStore.auction?.currentPrice">
                  {{ auctionStore.auction?.currentPrice }}
                </span>
              </VScrollYTransition>
              EGP
            </div>
          </section>

          <!--Details-->
          <section class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">SIM Details</h2>
            <VTable density="compact" class="text-body-2">
              <tbody>
                <tr>
                  <td class="pl-0">SIM Condition</td>
                  <td>{{ auctionStore.auction?.productCondition }}</td>
                </tr>
                <tr>
                  <td class="pl-0">SIM Category</td>
                  <td>{{ auctionStore.auction?.category }}</td>
                </tr>
                <tr>
                  <td class="pl-0">City</td>
                  <td>{{ auctionStore.auction?.city }}</td>
                </tr>
                <tr>
                  <td class="pl-0">Posted at</td>
                  <td>
                    {{ formatDate(auctionStore.auction?.startTime) }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </section>

          <!--Description-->
          <section v-if="auctionStore.auction?.productDescription" class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">SIM Description</h2>
            <p class="text-body-2">
              {{ auctionStore.auction?.productDescription }}
            </p>
          </section>

          <!--Time Remaning-->
          <section class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">Time Remaning</h2>
            <AuctionCountdown class="mt-2" />
          </section>
        </section>
      </VCol>
    </VRow>
  </VSheet>
</template>
