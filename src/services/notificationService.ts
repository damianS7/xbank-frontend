// services/notificationService.ts
import { ApiResponse } from "@/types/response/ApiResponse";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const notificationService = {
  async fetchNotifications(page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/notifications?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch notifications.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async deleteNotifications() {
    const response = await fetch(`${API}/notifications`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to delete notifications.",
        response.status,
        json.errors
      );
    }
  },
  async deleteNotification(id: number) {
    const response = await fetch(`${API}/notifications/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to delete notification.",
        response.status,
        json.errors
      );
    }
  },
};
