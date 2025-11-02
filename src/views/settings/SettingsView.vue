<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { onMounted, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { useSettingStore } from "@/stores/setting";
import Switch from "@/components/ui/switch/Switch.vue";
import PageLayout from "@/layouts/PageLayout.vue";

// store
const settingStore = useSettingStore();

// message to show
const alert = ref<InstanceType<typeof CustomAlert>>();

onMounted(async () => {
  await settingStore.initialize();
});
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Settings</h1>
      <Button @click="settingStore.updateSettings()" size="sm">Save</Button>
    </template>

    <template v-if="settingStore.settings" #content>
      <CustomAlert class="mb-4" ref="alert" />
      <form class="space-y-6">
        <!-- Enable 2FA -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium"
            >Enable Two-Factor Authentication (2FA)</label
          >
          <Switch
            v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
            class="data-[state=checked]:bg-blue-500"
          />
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium">Email Notifications</label>
          <!-- <input
            type="checkbox"
            v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
            class="w-5 h-5 accent-blue-500"
          /> -->
          <Switch
            v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
            class="data-[state=checked]:bg-blue-500"
          />
        </div>

        <!-- Language Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
          <select
            class="border rounded p-2 w-full sm:w-auto"
            v-model="settingStore.settings.LANGUAGE"
          >
            <option value="ES">Español</option>
            <option value="EN">English</option>
          </select>
        </div>
      </form>
    </template>
  </PageLayout>
</template>
