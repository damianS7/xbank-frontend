import { defineStore } from "pinia";
import type { Setting } from "@/modules/settings/types/Setting";
import { settingService } from "@/modules/settings/service/settingService";
import { ref } from "vue";
import type { SettingsUpdateRequest } from "@/modules/settings/types/SettingsUpdateRequest";

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

    localStorage.setItem("lang", settings.value.language.toLowerCase());
  }

  async function initialize() {
    await fetchSettings().then(() => {
      localStorage.setItem("lang", settings.value.language.toLowerCase());
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
