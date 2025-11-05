<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { onMounted, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { useSettingStore } from "@/stores/setting";
import PageLayout from "@/layouts/PageLayout.vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsGeneralTab from "./components/SettingsGeneralTab.vue";
import SettingsAccountTab from "./components/SettingsAccountTab.vue";
import SettingsSecurityTab from "./components/SettingsSecurityTab.vue";
import SettingsNotificationsTab from "./components/SettingsNotificationsTab.vue";

// store
const settingStore = useSettingStore();

// message to show
const alert = ref<InstanceType<typeof CustomAlert>>();

async function saveSettings() {
  try {
    await settingStore.updateSettings();
    alert.value?.success("Settings saved successfully", { timeout: 5 });
  } catch (exception: any) {
    alert.value?.exception(exception);
  }
}

onMounted(async () => {
  await settingStore.initialize();
});
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Settings</h1>
      <Button @click="saveSettings" size="sm">Save</Button>
    </template>

    <template v-if="settingStore.settings" #content>
      <CustomAlert ref="alert" />
      <Tabs
        default-value="account"
        class="grid grid-cols-[max(160px)_1fr] gap-4"
        orientation="horizontal"
      >
        <div>
          <TabsList class="grid grid-cols-1 w-full h-auto rounded-md shadow">
            <TabsTrigger value="general"> General </TabsTrigger>
            <TabsTrigger value="account"> Account </TabsTrigger>
            <TabsTrigger value="security"> Security </TabsTrigger>
            <TabsTrigger value="notifications"> Notifications </TabsTrigger>
          </TabsList>
        </div>

        <div>
          <SettingsGeneralTab />
          <SettingsAccountTab />
          <SettingsSecurityTab />
          <SettingsNotificationsTab />
        </div>
      </Tabs>
    </template>
  </PageLayout>
</template>
