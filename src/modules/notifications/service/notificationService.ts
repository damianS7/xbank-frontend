// services/notificationService.ts
import { ApiResponse } from "@/types/api/response/ApiResponse";
import type { PaginatedResponse } from "@/types/api/response/PaginatedResponse";
import { buildHeaders } from "@/utils/baseHeaders";

const API = import.meta.env.VITE_APP_API_URL;

export const notificationService = {
  async fetchNotifications(page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/notifications?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: buildHeaders({ json: true }),
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
      headers: buildHeaders({ json: true }),
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
      headers: buildHeaders({ json: true }),
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
  async deleteNotificationsById(notificationIds: number[]) {
    const response = await fetch(`${API}/notifications`, {
      method: "DELETE",
      headers: buildHeaders({ json: true }),
      body: JSON.stringify({ notificationIds }),
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
};
