<script setup>
import CategoryItem from "./CategoryItem.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { onBeforeMount } from "vue";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const categoriesStore = useCategoriesStore();

onBeforeMount(async () => {
  await categoriesStore.load();
});
</script>

<template>
  <section>
    <!--Title-->
    <div class="d-flex align-center ga-2 mb-3">
      <VIcon icon="mdi-shape-plus" :size="xs ? 'small' : 'default'" />
      <h2 :class="xs ? 'text-h6' : 'text-h5'">Categories</h2>
    </div>

    <!--Loading State-->
    <VRow v-if="categoriesStore.loading" justify="center" dense>
      <VCol v-for="i in 12" :key="i" cols="3" sm="2">
        <VSkeletonLoader
          type="image"
          :height="xs ? '65px' : '85px'"
          class="overflow-hidden"
        />
      </VCol>
    </VRow>

    <!--Categories Grid-->
    <VRow v-else justify="center" dense>
      <VCol
        v-for="category in categoriesStore.categories"
        :key="category.id"
        cols="3"
        sm="2"
      >
        <CategoryItem :category="category" />
      </VCol>
    </VRow>
  </section>
</template>
