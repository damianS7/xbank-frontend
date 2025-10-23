import { defineStore } from "pinia";
import type { BankingAccount } from "@/types/BankingAccount";
import type { BankingCard } from "@/types/BankingCard";
import { computed, ref } from "vue";
import { accountService } from "@/services/accountService";
export const useAccountStore = defineStore("account", () => {
  const bankingAccounts = ref<BankingAccount[]>([]);
  const initialized = ref(false);

  const countAccounts = computed(() => {
    return bankingAccounts.value.length;
  });

  const countCards = computed(() => {
    return bankingAccounts.value.reduce((total, account) => {
      return total + (account.accountCards?.length || 0);
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
    bankingAccounts.value = await accountService.fetchAccounts();
    return bankingAccounts.value;
  }

  async function requestBankingAccount(
    type: string,
    currency: string
  ): Promise<BankingAccount> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountType: type,
            accountCurrency: currency,
          }),
        }
      );

      // if response is not 200, throw an error
      if (response.status !== 201) {
        const error = await response.json();
        throw new Error(error.message || "Failed to open account");
      }

      const account = await response.json();

      return {
        ...account,
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      } as BankingAccount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to open account");
    }
  }
  async function requestBankingCard(
    accountId: string,
    cardType: string
  ): Promise<BankingCard> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/` +
          accountId +
          "/cards/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cardType,
          }),
        }
      );

      // if response is not 201, throw an error
      if (response.status !== 201) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request card");
      }

      const card = await response.json();
      return {
        ...card,
        expiredDate: new Date(card.expiredDate),
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      } as BankingCard;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to request card");
    }
  }

  async function updateBankingAccountAlias(
    accountId: string,
    alias: string,
    password: string
  ): Promise<BankingAccount> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/` +
          accountId +
          "/alias",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            alias,
            password,
          }),
        }
      );

      // if response is not 200, throw an error
      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.message || "Failed to set an alias");
      }

      const account = await response.json();

      return {
        ...account,
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      } as BankingAccount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to set an alias");
    }
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
    console.log("Initializing account store...");
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
