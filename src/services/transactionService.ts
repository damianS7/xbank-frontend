import { ApiResponse } from "@/types/response/ApiResponse";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";
import type { BankingTransaction } from "@/types/BankingTransaction";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const transactionService = {
  async fetchTransaction(transactionId: number): Promise<BankingTransaction> {
    const response = await fetch(
      `${API}/banking/transactions/${transactionId}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch transaction.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async fetchAccountTransactions(
    accountId: number,
    page: number,
    size: number
  ): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/customers/me/banking/accounts/${accountId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch account transactions.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async fetchCardTransactions(
    cardId: number,
    page: number,
    size: number
  ): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/customers/me/banking/cards/${cardId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch card transactions.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async createBankingTransaction(
    fromBankingAccountId: string,
    toBankingAccountNumber: string,
    amount: number,
    description: string,
    transactionType: string,
    password: string
  ): Promise<BankingTransaction> {
    const response = await fetch(
      `${API}/customers/me/banking/accounts/${fromBankingAccountId}/transactions`,
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          toBankingAccountNumber,
          transactionType,
          description,
          amount,
          password,
        }),
      }
    );

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to create transaction.",
        response.status,
        json.errors
      );
    }

    return json;
  },
};
