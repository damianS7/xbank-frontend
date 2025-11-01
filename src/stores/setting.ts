import { defineStore } from "pinia";
import type { Setting } from "@/types/Setting";
import { settingService } from "@/services/settingService";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const initialized = ref(false);
  const settings = ref<Record<string, object[]>>(
    {} as Record<string, object[]>
  );

  async function fetchSettings(): Promise<void> {
    const fetchedSettings: Setting = await settingService.fetchSettings();
    settings.value = fetchedSettings.settings;
  }

  async function updateSettings(): Promise<void> {
    const updatedSettings: Setting = await settingService.updateSettings(
      settings.value
    );
    settings.value = updatedSettings.settings;
  }

  async function initialize() {
    await fetchSettings().then(() => {
      initialized.value = true;
    });
  }

  return {
    initialized,
    fetchSettings,
    updateSettings,
    settings,
    initialize,
  };
});
