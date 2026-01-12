import { ApiResponse } from "@/types/response/ApiResponse";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";
import type { BankingTransfer } from "@/types/BankingTransfer";
import { buildHeaders } from "./api/baseHeaders";

const API = import.meta.env.VITE_APP_API_URL;

export const transferService = {
  async fetchTransfers(page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/banking/transfers?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: buildHeaders({ json: true }),
      }
    );

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch transfers",
        response.status,
        json.errors
      );
    }

    return json as BankingTransfer[];
  },
  async transfer(
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string
  ): Promise<BankingTransfer> {
    const response = await fetch(`${API}/banking/transfers`, {
      method: "POST",
      headers: buildHeaders({ json: true }),
      body: JSON.stringify({
        fromAccountId,
        toAccountNumber,
        description,
        amount,
      }),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to create transfer.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async approve(
    transferId: number,
    password: string
  ): Promise<BankingTransfer> {
    const response = await fetch(
      `${API}/banking/transfers/${transferId}/confirm`,
      {
        method: "POST",
        headers: buildHeaders({ json: true }),
        body: JSON.stringify({
          transferId,
          password,
        }),
      }
    );

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to approve transfer.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async reject(transferId: number, password: string): Promise<BankingTransfer> {
    const response = await fetch(
      `${API}/banking/transfers/${transferId}/reject`,
      {
        method: "POST",
        headers: buildHeaders({ json: true }),
        body: JSON.stringify({
          transferId,
          password,
        }),
      }
    );

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to reject transfer.",
        response.status,
        json.errors
      );
    }

    return json;
  },
};
