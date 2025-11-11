import { defineStore } from "pinia";
import type { BankingTransaction } from "@/types/BankingTransaction";
import { computed, ref } from "vue";
import { transactionService } from "@/services/transactionService";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref<BankingTransaction[]>([]);

  const getTransaction = computed(() => {
    return (id: number) => {
      return transactions.value.find((transaction) => transaction.id === id);
    };
  });

  async function fetchTransaction(
    transactionId: number
  ): Promise<BankingTransaction> {
    const transaction: BankingTransaction =
      await transactionService.fetchTransaction(transactionId);
    return parseTransaction(transaction);
  }

  async function fetchAccountTransactions(
    accountId: number,
    page: number,
    size: number,
    returnPaginated: boolean = false
  ): Promise<BankingTransaction[] | PaginatedResponse> {
    const paginatedResponse: PaginatedResponse =
      await transactionService.fetchAccountTransactions(accountId, page, size);

    transactions.value = paginatedResponse.content.map((transaction: any) =>
      parseTransaction(transaction)
    );

    return returnPaginated ? paginatedResponse : transactions.value;
  }

  async function fetchCardTransactions(
    cardId: number,
    page: number,
    size: number,
    returnPaginated: boolean = false
  ): Promise<BankingTransaction[] | PaginatedResponse> {
    const paginatedResponse = await transactionService.fetchCardTransactions(
      cardId,
      page,
      size
    );

    // replace content with parsed dates
    transactions.value = paginatedResponse.content.map((transaction: any) =>
      parseTransaction(transaction)
    );

    return returnPaginated ? paginatedResponse : transactions.value;
  }

  async function createBankingTransaction(
    fromBankingAccountId: string,
    toBankingAccountNumber: string,
    amount: number,
    description: string,
    transactionType: string,
    password: string
  ): Promise<BankingTransaction> {
    const transaction = await transactionService.createBankingTransaction(
      fromBankingAccountId,
      toBankingAccountNumber,
      amount,
      description,
      transactionType,
      password
    );

    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
    } as BankingTransaction;
  }

  function parseTransaction(
    transaction: BankingTransaction
  ): BankingTransaction {
    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
    };
  }

  function setTransactions(transactions: any) {
    transactions.value = transactions;
  }

  function addTransaction(transaction: BankingTransaction) {
    // const account = getBankingAccount(transaction.accountId);
    // account?.accountTransactions.push(transaction);
    transactions.value = [...transactions.value, transaction];
  }

  function resetStore() {
    transactions.value = [];
  }

  return {
    transactions,
    resetStore,
    fetchAccountTransactions,
    fetchCardTransactions,
    fetchTransaction,
    createBankingTransaction,
    setTransactions,
    addTransaction,
    getTransaction,
    // pagination,
  };
});
