<script setup lang="ts">
// vue core
import { onMounted, ref } from "vue";

// layout
import PageLayout from "@/layouts/PageLayout.vue";

// ui
import Button from "@/components/ui/button/Button.vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// components
import CustomAlert from "@/components/CustomAlert.vue";
import SettingsPrivacyTab from "./components/SettingsPrivacyTab.vue";
import SettingsGeneralTab from "./components/SettingsGeneralTab.vue";
import SettingsAccountTab from "./components/SettingsAccountTab.vue";
import SettingsSecurityTab from "./components/SettingsSecurityTab.vue";
import SettingsNotificationsTab from "./components/SettingsNotificationsTab.vue";

// stores
import { useModalStore } from "@/stores/modal";
import { useSettingStore } from "@/stores/setting";

// state
const modalStore = useModalStore();
const settingStore = useSettingStore();
const alert = ref<InstanceType<typeof CustomAlert>>();

// methods
async function saveSettings() {
  try {
    await settingStore.updateSettings();
    alert.value?.success("Settings saved successfully", { timeout: 5 });
  } catch (exception: any) {
    alert.value?.exception(exception);
  }
}

async function deleteCache() {
  const confirm = (await modalStore.open("ConfirmMessage", {
    title: "Are you sure",
    message: "Do you wish to delete local cache?",
  })) as string;

  // if(confirm)
  // emit message to parent
}

async function lockAccount() {
  // const days = (await modalStore.open("LockAccountDays", {
  //   title: "Are you sure",
  //   message: "Do you wish to lock your account?",
  // })) as string;

  const confirm = (await modalStore.open("ConfirmMessage", {
    title: "Are you sure",
    message: "Do you wish to lock your account?",
  })) as string;

  // if(confirm)
  // emit message to parent
}

async function closeAccount() {
  const confirm = (await modalStore.open("ConfirmMessage", {
    title: "Are you sure",
    message: "Do you wish to delete close your account?",
  })) as string;

  // if(confirm)
  // emit message to parent
}

onMounted(async () => {
  await settingStore.initialize();
});
</script>
<template>
  <PageLayout>
    <template #header>
      <div class="flex items-center justify-between">
        <h1>Settings</h1>
        <Button @click="saveSettings" size="sm">Save</Button>
      </div>
    </template>

    <template v-if="settingStore.settings" #content>
      <CustomAlert ref="alert" />
      <Tabs
        default-value="general"
        class="grid sm:grid-cols-[max(160px)_1fr] gap-4"
        orientation="horizontal"
      >
        <div>
          <TabsList class="grid grid-cols-1 w-full h-auto rounded-md shadow">
            <TabsTrigger value="general"> General </TabsTrigger>
            <TabsTrigger value="account"> Account </TabsTrigger>
            <TabsTrigger value="security"> Security </TabsTrigger>
            <TabsTrigger value="privacy"> Privacy </TabsTrigger>
            <TabsTrigger value="notifications"> Notifications </TabsTrigger>
          </TabsList>
        </div>

        <div>
          <SettingsGeneralTab @deleteCache="deleteCache" />
          <SettingsAccountTab
            @lockAccount="lockAccount"
            @closeAccount="closeAccount"
          />
          <SettingsPrivacyTab />
          <SettingsSecurityTab />
          <SettingsNotificationsTab />
        </div>
      </Tabs>
    </template>
  </PageLayout>
</template>
