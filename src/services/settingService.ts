import type { SettingsUpdateRequest } from "@/types/request/SettingsUpdateRequest";
import { ApiResponse } from "@/types/response/ApiResponse";
import type { Setting } from "@/types/Setting";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const settingService = {
  async fetchSettings(): Promise<Setting> {
    const response = await fetch(`${API}/settings`, {
      method: "GET",
      headers: authHeader(),
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

    return json;
  },

  async updateSettings(request: SettingsUpdateRequest): Promise<Setting> {
    const response = await fetch(`${API}/settings`, {
      method: "PATCH",
      headers: authHeader(),
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

    return json;
  },
};
