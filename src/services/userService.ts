import type { UserRegisterRequest } from "@/types/request/UserRegisterRequest";
import { ApiResponse } from "@/types/response/ApiResponse";
import type { User } from "@/types/User2";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {
  async fetchUser(): Promise<User> {
    const response = await fetch(`${API}/users`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch user.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async updateEmail(currentPassword: string, newEmail: string): Promise<User> {
    const response = await fetch(`${API}/users/email`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newEmail }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update email.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API}/users/password`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to update password.",
        response.status,
        json.errors
      );
    }
  },
  async register(fields: UserRegisterRequest) {
    const response = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Registration failed.",
        response.status,
        json.errors
      );
    }

    return json;
  },
};
