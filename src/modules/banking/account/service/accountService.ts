import { ApiResponse } from "@/types/response/ApiResponse";
import type { BankingAccount } from "@/modules/banking/account/types/BankingAccount";
import type { BankingAccountCreateRequest } from "@/modules/banking/account/types/BankingAccountCreateRequest";
import type { BankingAccountCardRequest } from "@/modules/banking/account/types/BankingAccountCardRequest";
import type { BankingCard } from "@/modules/banking/card/types/BankingCard";
import type { BankingAccountAliasUpdateRequest } from "@/modules/banking/account/types/BankingAccountAliasUpdateRequest";
import { buildHeaders } from "@/utils/baseHeaders";
import type { UpdateAccountAliasResponse } from "@/modules/banking/account/types/types";

const API = import.meta.env.VITE_APP_API_URL;

export const accountService = {
  async fetchAccounts(): Promise<BankingAccount[]> {
    const response = await fetch(`${API}/banking/accounts`, {
      method: "GET",
      headers: buildHeaders({ json: true }),
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
  async chartData(currency: string): Promise<[string, string][]> {
    const response = await fetch(
      `${API}/banking/accounts/summary/${currency}`,
      {
        method: "GET",
        headers: buildHeaders({ json: true }),
      }
    );

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch dashboard data",
        response.status,
        json.errors
      );
    }

    return json as [string, string][];
  },

  async requestBankingAccount(
    request: BankingAccountCreateRequest
  ): Promise<BankingAccount> {
    const response = await fetch(`${API}/banking/accounts`, {
      method: "POST",
      headers: buildHeaders({ json: true }),
      body: JSON.stringify(request),
    });

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
      `${API}/banking/accounts/` + accountId + "/cards",
      {
        method: "POST",
        headers: buildHeaders({ json: true }),
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
    accountId: number,
    request: BankingAccountAliasUpdateRequest
  ): Promise<UpdateAccountAliasResponse> {
    const response = await fetch(
      `${API}/banking/accounts/` + accountId + "/alias",
      {
        method: "PATCH",
        headers: buildHeaders({ json: true }),
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

    return json as UpdateAccountAliasResponse;
  },
};
