import { defineStore } from "pinia";
import type { Setting } from "@/types/Setting";
import { settingService } from "@/services/settingService";
import { ref } from "vue";
import type { SettingsUpdateRequest } from "@/types/request/SettingsUpdateRequest";

export const useSettingStore = defineStore("setting", () => {
  const initialized = ref(false);
  const settings = ref<Setting>({} as Setting);

  async function fetchSettings(): Promise<void> {
    const fetchedSettings: Setting = await settingService.fetchSettings();
    settings.value = fetchedSettings;
  }

  async function updateSettings(): Promise<void> {
    const request: SettingsUpdateRequest = { settings: settings.value };
    const updatedSettings: Setting =
      await settingService.updateSettings(request);
    settings.value = updatedSettings;
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
