import { defineStore } from "pinia";
import type { BankingTransaction } from "@/types/BankingTransaction";
import type { FieldException } from "@/exceptions/FieldException";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [] as BankingTransaction[],
    initialized: false,
  }),
  getters: {
    getAccountTransactions: (state) => {
      // return (id: number) => {
      //   return state.bankingAccounts.find((account) => account.id === id);
      // };
    },
  },
  actions: {
    async fetchAccountTransactions(
      accountId: number,
      page: number,
      size: number
    ): Promise<BankingTransaction> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/${accountId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Failed to tetch transactions");
        }

        const paginatedTransactions = await response.json();
        const parsedTransactions = paginatedTransactions.content.map(
          (transaction: any) => ({
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt),
          })
        );

        // replace content with parsed dates
        paginatedTransactions.content = parsedTransactions;
        return paginatedTransactions;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Failed to fetch transactions");
      }
    },
    async fetchCardTransactions(
      id: number,
      page: number,
      size: number
    ): Promise<BankingTransaction[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${id}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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

          throw new Error(error.message || "Failed to fetch transactions.");
        }

        const paginatedTransactions = await response.json();
        const parsedTransactions = paginatedTransactions.content.map(
          (transaction: any) => ({
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt),
          })
        );

        // replace content with parsed dates
        paginatedTransactions.content = parsedTransactions;
        return paginatedTransactions;
      } catch (error: unknown) {
        if (error instanceof FieldException || error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch transactions");
      }
    },
    async createBankingTransaction(
      fromBankingAccountId: string,
      toBankingAccountNumber: string,
      amount: string,
      description: string,
      transactionType: string,
      password: string
    ): Promise<BankingTransaction> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/${fromBankingAccountId}/transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              toBankingAccountNumber,
              transactionType,
              description,
              amount,
              password,
            }),
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create transaction.");
        }

        const transaction = await response.json();

        return {
          ...transaction,
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        } as BankingTransaction;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error("Failed to create transaction.");
      }
    },
    setTransactions(transactions: any) {
      // this.bankingAccounts = accounts;
    },
    addTransaction(transaction: BankingTransaction) {
      // const account = this.getBankingAccount(transaction.bankingAccountId);
      // account?.accountTransactions.push(transaction);
    },
  },
});
