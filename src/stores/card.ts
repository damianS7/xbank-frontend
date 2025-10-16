import { defineStore } from "pinia";
import type { BankingCard, BankingCardLockStatus } from "../types/BankingCard";
import type { BankingTransaction } from "@/types/BankingTransaction";
import type { FieldException } from "@/exceptions/FieldException";

export const useCardStore = defineStore("card", {
  state: () => ({
    bankingCards: [] as BankingCard[],
    initialized: false,
  }),

  getters: {
    countCards: (state) => {
      return state.bankingCards.length;
    },
    countCardsByAccount: (state) => {
      return (accountId: number) => {
        return state.bankingCards.filter(
          (card) => card.bankingAccountId === accountId
        ).length;
      };
    },
    getBankingCard: (state) => {
      return (id: number) => {
        return state.bankingCards.find((card) => card.id === id);
      };
    },
    getBankingCards: (state) => {
      return state.bankingCards;
    },
    getBankingCardsByAccountId: (state) => {
      return (accountId: number) => {
        return state.bankingCards.filter(
          (card) => card.bankingAccountId === accountId
        );
      };
    },
  },

  actions: {
    async fetchBankingCards() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // problem setting pin
          const error = await response.json();

          // if the field errors exists we used a custom exception
          if (error.errors) {
            throw new FieldException(error.message, error.errors);
          }

          throw new Error(error.message || "Failed to fetch cards.");
        }

        const cards = await response.json();
        return cards.map((card: any) => ({
          ...card,
          transactions: [],
          expiredDate: new Date(card.expiredDate),
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        }));
      } catch (error: unknown) {
        if (error instanceof FieldException || error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch cards.");
      }
    },
    async setCardPin(
      id: number,
      pin: string,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${id}/pin`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pin, password }),
          }
        );

        if (!response.ok) {
          // problem setting pin
          const error = await response.json();

          // if the field errors exists we used a custom exception
          if (error.errors) {
            throw new FieldException(error.message, error.errors);
          }

          throw new Error(error.message || "Failed to set pin.");
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };

        return card as BankingCard;
      } catch (error: unknown) {
        if (error instanceof FieldException || error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to set pin.");
      }
    },
    async setDailyLimit(
      id: number,
      dailyLimit: number,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${id}/daily-limit`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dailyLimit, password }),
          }
        );

        // if response is not 200, throw an error
        if (!response.ok) {
          // problem setting pin
          const error = await response.json();

          // if the field errors exists we used a custom exception
          if (error.errors) {
            throw new FieldException(error.message, error.errors);
          }

          throw new Error(error.message || "Failed to set daily limit.");
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };
        return card as BankingCard;
      } catch (error: unknown) {
        if (error instanceof FieldException || error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to set daily limit.");
      }
    },
    async setLockStatus(
      id: number,
      lockStatus: BankingCardLockStatus,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${id}/lock-status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lockStatus, password }),
          }
        );

        if (!response.ok) {
          // problem setting pin
          const error = await response.json();

          // if the field errors exists we used a custom exception
          if (error.errors) {
            throw new FieldException(error.message, error.errors);
          }

          throw new Error(error.message || "Failed to set lock.");
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };
        return card as BankingCard;
      } catch (error: unknown) {
        if (error instanceof FieldException || error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to set lock.");
      }
    },
    setCards(cards: any) {
      this.bankingCards = cards;
    },
    setCard(card: BankingCard) {
      const index = this.bankingCards.findIndex((a) => a.id === card.id);
      if (index !== -1) {
        // this.bankingCards[index] = card; // non reactive
        this.bankingCards.splice(index, 1, card); // reactive
      }
    },
    addCard(card: BankingCard) {
      this.bankingCards.push(card);
    },
    setCardTransactions(cardId: number, transactions: any) {
      const index = this.bankingCards.findIndex((a) => a.id === cardId);
      if (index !== -1) {
        // this.bankingCards.splice(index, 1, transactions);
        this.bankingCards[index].transactions = transactions;
      }
    },
    removeCard(cardId: number) {
      const index = this.bankingCards.findIndex((a) => a.id === cardId);
      if (index !== -1) {
        this.bankingCards.splice(index, 1);
      }
    },
    async initialize() {
      if (this.initialized) {
        return;
      }

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const cards = await this.fetchBankingCards();
        this.setCards(cards);
      }
      this.initialized = true;
    },
  },
});
