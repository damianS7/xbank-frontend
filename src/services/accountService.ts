import { ApiResponse } from "@/types/response/ApiResponse";
import type { Customer } from "@/types/Customer";
import type { BankingAccount } from "@/types/BankingAccount";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const accountService = {
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

    return json.map((account: any) => ({
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
    })) as BankingAccount[];
  },
};
