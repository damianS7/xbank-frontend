import { ApiResponse } from "@/types/response/ApiResponse";
import type { Customer } from "@/types/Customer";
import type { CustomerRegisterRequest } from "@/types/request/CustomerRegisterRequest";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const customerService = {
  async fetchCustomer(): Promise<Customer> {
    const response = await fetch(`${API}/customers`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch customer.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async fetchProfileImage(customerId: number): Promise<Blob> {
    const response = await fetch(`${API}/customers/${customerId}/image`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to fetch customer profile image.",
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

    const response = await fetch(`${API}/customers/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to upload customer profile image.",
        response.status,
        json.errors
      );
    }
    return (await response.blob()) as Blob;
  },
  async updateCustomer(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Customer> {
    const response = await fetch(`${API}/customers`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, fieldsToUpdate }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update customer.",
        response.status,
        json.errors
      );
    }

    return json as Customer;
  },
  async updateEmail(
    currentPassword: string,
    newEmail: string
  ): Promise<Customer> {
    const response = await fetch(`${API}/customers/email`, {
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
    const response = await fetch(`${API}/customers/password`, {
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
  async register(fields: CustomerRegisterRequest) {
    const response = await fetch(`${API}/customers/register`, {
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
