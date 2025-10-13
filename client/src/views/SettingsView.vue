<script setup>
import ProfileSettingsSubView from "@/components/SettingsView/ProfileSettingsSubView.vue";
import SecuritySettingsSubView from "@/components/SettingsView/SecuritySettingsSubView.vue";
import { ref } from "vue";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const tab = ref("profile");
</script>

<template>
  <VContainer class="h-100">
    <VSheet class="h-100" elevation="1">
      <VToolbar
        color="primary"
        :class="`rounded-t ${smAndDown ? '' : 'mb-4'}`"
        density="compact"
        title="Settings"
      />

      <div class="d-flex flex-column flex-md-row h-100">
        <VTabs
          v-model="tab"
          color="primary"
          :fixed-tabs="smAndDown"
          :direction="smAndDown ? 'horizontal' : 'vertical'"
        >
          <VTab prepend-icon="mdi-account" text="Profile" value="profile" />
          <VTab prepend-icon="mdi-lock" text="Security" value="security" />
        </VTabs>

        <VTabsWindow v-model="tab" class="w-100 px-6 flex-grow-1 py-10 py-md-0">
          <VTabsWindowItem value="profile">
            <ProfileSettingsSubView />
          </VTabsWindowItem>
          <VTabsWindowItem value="security">
            <SecuritySettingsSubView />
          </VTabsWindowItem>
        </VTabsWindow>
      </div>
    </VSheet>
  </VContainer>
</template>
