import { ApiResponse } from "@/types/response/ApiResponse";
import type { BankingAccount } from "@/types/BankingAccount";
import type { BankingAccountCreateRequest } from "@/types/request/BankingAccountCreateRequest";
import type { BankingAccountCardRequest } from "@/types/request/BankingAccountCardRequest";
import type { BankingCard } from "@/types/BankingCard";
import type { BankingAccountUpdateRequest } from "@/types/request/BankingAccountUpdateRequest";
import type { BankingAccountAliasUpdateRequest } from "@/types/request/BankingAccountAliasUpdateRequest";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const accountService = {
  async fetchAccounts(): Promise<BankingAccount[]> {
    const response = await fetch(`${API}/customers/me/banking/accounts`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch accounts",
        response.status,
        json.errors
      );
    }

    return json as BankingAccount[];
  },

  async requestBankingAccount(
    request: BankingAccountCreateRequest
  ): Promise<BankingAccount> {
    const response = await fetch(
      `${API}/customers/me/banking/accounts/request`,
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(request),
      }
    );

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to create account",
        response.status,
        json.errors
      );
    }

    return json as BankingAccount;
  },

  async requestBankingCard(
    accountId: string,
    request: BankingAccountCardRequest
  ): Promise<BankingCard> {
    const response = await fetch(
      `${API}/customers/me/banking/accounts/` + accountId + "/cards/request",
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(request),
      }
    );

    const json = await response.json();

    // if response is not 201, throw an error
    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to create card",
        response.status,
        json.errors
      );
    }

    return json as BankingCard;
  },

  async updateBankingAccountAlias(
    accountId: string,
    request: BankingAccountAliasUpdateRequest
  ): Promise<BankingAccount> {
    const response = await fetch(
      `${API}/customers/me/banking/accounts/` + accountId + "/alias",
      {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify(request),
      }
    );

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update account",
        response.status,
        json.errors
      );
    }

    return json as BankingAccount;
  },
};
