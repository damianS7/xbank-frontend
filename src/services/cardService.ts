import { ApiResponse } from "@/types/response/ApiResponse";
import type { BankingCard, BankingCardLockStatus } from "@/types/BankingCard";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const cardService = {
  async fetchCards(): Promise<BankingCard[]> {
    const response = await fetch(`${API}/banking/cards`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch cards",
        response.status,
        json.errors
      );
    }

    return json.map((card: any) => ({
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    })) as BankingCard[];
  },

  async setPIN(
    cardId: number,
    pin: string,
    password: string
  ): Promise<BankingCard> {
    const response = await fetch(`${API}/banking/cards/${cardId}/pin`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ pin, password }),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to set card PIN",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async setDailyLimit(
    cardId: number,
    dailyLimit: number,
    password: string
  ): Promise<BankingCard> {
    const response = await fetch(`${API}/banking/cards/${cardId}/daily-limit`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ dailyLimit, password }),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to set daily limit for card",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async lock(cardId: number, password: string): Promise<BankingCard> {
    const response = await fetch(`${API}/banking/cards/${cardId}/lock`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ password }),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to lock card",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async unlock(cardId: number, password: string): Promise<BankingCard> {
    const response = await fetch(`${API}/banking/cards/${cardId}/unlock`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ password }),
    });

    const json = await response.json();

    // if response is not 200, throw an error
    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to unlock card",
        response.status,
        json.errors
      );
    }

    return json;
  },
};
