import { defineStore } from "pinia";
import type { BankingTransaction } from "@/types/BankingTransaction";
import { ref } from "vue";
import { transactionService } from "@/services/transactionService";

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref<BankingTransaction[]>([]);

  async function fetchAccountTransactions(
    accountId: number,
    page: number,
    size: number
  ): Promise<BankingTransaction[]> {
    const paginatedTransactions =
      await transactionService.fetchAccountTransactions(accountId, page, size);

    const parsedTransactions = paginatedTransactions.content.map(
      (transaction: any) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      })
    );

    // replace content with parsed dates
    paginatedTransactions.content = parsedTransactions;
    return transactions.value;
  }

  async function fetchCardTransactions(
    cardId: number,
    page: number,
    size: number
  ): Promise<BankingTransaction[]> {
    const paginatedTransactions =
      await transactionService.fetchAccountTransactions(cardId, page, size);

    const parsedTransactions = paginatedTransactions.content.map(
      (transaction: any) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      })
    );

    // replace content with parsed dates
    paginatedTransactions.content = parsedTransactions;
    return transactions.value;
  }

  async function createBankingTransaction(
    fromBankingAccountId: string,
    toBankingAccountNumber: string,
    amount: string,
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

  function setTransactions(transactions: any) {
    transactions.value = transactions;
  }

  function addTransaction(transaction: BankingTransaction) {
    // const account = getBankingAccount(transaction.accountId);
    // account?.accountTransactions.push(transaction);
    transactions.value = [...transactions.value, transaction];
  }

  return {
    transactions,
    fetchAccountTransactions,
    fetchCardTransactions,
    createBankingTransaction,
    setTransactions,
    addTransaction,
  };
});
