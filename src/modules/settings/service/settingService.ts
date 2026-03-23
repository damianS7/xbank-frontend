import type { SettingsUpdateRequest } from "@/modules/settings/types/SettingsUpdateRequest";
import { ApiResponse } from "@/types/response/ApiResponse";
import type { Setting } from "@/modules/settings/types/Setting";
import { buildHeaders } from "@/utils/baseHeaders";

const API = import.meta.env.VITE_APP_API_URL;

export const settingService = {
  async fetchSettings(): Promise<Setting> {
    const response = await fetch(`${API}/settings`, {
      method: "GET",
      headers: buildHeaders({ json: true }),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch settings.",
        response.status,
        json.errors
      );
    }

    return json.settings;
  },

  async updateSettings(request: SettingsUpdateRequest): Promise<Setting> {
    const response = await fetch(`${API}/settings`, {
      method: "PATCH",
      headers: buildHeaders({ json: true }),
      body: JSON.stringify(request),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update settings.",
        response.status,
        json.errors
      );
    }

    return json.settings;
  },
};
