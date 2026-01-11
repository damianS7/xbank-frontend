import { ApiResponse } from "@/types/response/ApiResponse";
import type { Profile } from "@/types/Profile";
import { buildHeaders } from "./api/baseHeaders";

const API = import.meta.env.VITE_APP_API_URL;

export const profileService = {
  async fetchProfile(): Promise<Profile> {
    const response = await fetch(`${API}/profiles`, {
      method: "GET",
      headers: buildHeaders({ json: true }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch profile.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async fetchProfileImage(userId: number): Promise<Blob> {
    const response = await fetch(`${API}/profiles/${userId}/image`, {
      method: "GET",
      headers: buildHeaders({ json: true }),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to fetch profile image.",
        response.status,
        json.errors
      );
    }
    return (await response.blob()) as Blob;
  },
  async uploadProfileImage(currentPassword: string, file: any): Promise<Blob> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentPassword", currentPassword);

    const response = await fetch(`${API}/profiles/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to upload profile image.",
        response.status,
        json.errors
      );
    }
    return (await response.blob()) as Blob;
  },
  async updateProfile(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Profile> {
    const response = await fetch(`${API}/profiles`, {
      method: "PATCH",
      headers: buildHeaders({ json: true }),
      body: JSON.stringify({ currentPassword, fieldsToUpdate }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update profile.",
        response.status,
        json.errors
      );
    }

    return json as Profile;
  },
};
