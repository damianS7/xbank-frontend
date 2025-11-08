import { defineStore } from "pinia";
import type {
  BankingAccount,
  BankingAccountCurrency,
  BankingAccountType,
} from "@/types/BankingAccount";
import type { BankingCard, BankingCardType } from "@/types/BankingCard";
import { computed, ref } from "vue";
import { accountService } from "@/services/accountService";
import type { BankingAccountCreateRequest } from "@/types/request/BankingAccountCreateRequest";
import type { BankingAccountCardRequest } from "@/types/request/BankingAccountCardRequest";
import type { BankingAccountAliasUpdateRequest } from "@/types/request/BankingAccountAliasUpdateRequest";
export const useAccountStore = defineStore("account", () => {
  const bankingAccounts = ref<BankingAccount[]>([]);
  const initialized = ref(false);

  const countAccounts = computed(() => {
    return bankingAccounts.value.length;
  });

  const countCards = computed(() => {
    return bankingAccounts.value.reduce((total, account) => {
      return total + (account.totalCards || 0);
    }, 0);
  });

  const getBankingAccount = computed(() => {
    return (id: number) => {
      return bankingAccounts.value.find((account) => account.id === id);
    };
  });

  const getBankingCards = computed(() => {
    return bankingAccounts.value.flatMap((account) => account.accountCards);
  });

  async function fetchAccounts(): Promise<BankingAccount[]> {
    const accounts: BankingAccount[] = await accountService.fetchAccounts();

    for (const account of accounts) {
      account.createdAt = new Date(account.createdAt);
      account.updatedAt = new Date(account.updatedAt);
    }

    bankingAccounts.value = accounts;
    return bankingAccounts.value;
  }

  async function requestBankingAccount(
    type: BankingAccountType,
    currency: BankingAccountCurrency
  ): Promise<BankingAccount> {
    const request: BankingAccountCreateRequest = {
      type,
      currency,
    };

    const account: BankingAccount =
      await accountService.requestBankingAccount(request);

    return {
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
    } as BankingAccount;
  }

  async function requestBankingCard(
    accountId: string,
    cardType: BankingCardType
  ): Promise<BankingCard> {
    const request: BankingAccountCardRequest = {
      type: cardType,
    };

    const card: BankingCard = await accountService.requestBankingCard(
      accountId,
      request
    );

    return {
      ...card,
      expiredDate: new Date(card.expiredDate),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    } as BankingCard;
  }

  async function updateBankingAccountAlias(
    accountId: string,
    alias: string
  ): Promise<BankingAccount> {
    const request: BankingAccountAliasUpdateRequest = {
      alias,
    };

    const account: BankingAccount =
      await accountService.updateBankingAccountAlias(accountId, request);

    // find and update the account in the store
    setAccount(account);

    return {
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
    } as BankingAccount;
  }

  function setAccount(account: any) {
    const index = bankingAccounts.value.findIndex(
      (account) => account.id === account.id
    );

    if (index !== -1) {
      // bankingAccounts[index] = account;
      bankingAccounts.value.splice(index, 1, account);
    }
  }
  function setBalance(accountId: number, balance: number) {
    const account = bankingAccounts.value.find((acc) => acc.id === accountId);
    if (account) {
      account.balance = balance;
    }
  }

  function addAccount(account: BankingAccount) {
    // bankingAccounts.push(account);
    bankingAccounts.value = [...bankingAccounts.value, account];
  }

  function addCard(accountId: number, card: BankingCard) {
    const account = bankingAccounts.value.find(
      (account) => account.id === accountId
    );
    account?.accountCards.push(card);
  }

  async function initialize() {
    // get the accounts
    await fetchAccounts().then(() => {
      // store initialized
      initialized.value = true;
    });
  }

  return {
    initialized,
    initialize,
    countAccounts,
    countCards,
    updateBankingAccountAlias,
    addAccount,
    addCard,
    setBalance,
    setAccount,
    requestBankingAccount,
    requestBankingCard,
    getBankingAccount,
    getBankingCards,
    bankingAccounts,
  };
});
