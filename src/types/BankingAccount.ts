import type { BankingTransaction } from "@/types/BankingTransaction";
import type { BankingCard } from "@/types/BankingCard";

export const BankingAccountTypes = ["SAVINGS", "CHECKING"] as const;
export type BankingAccountType = (typeof BankingAccountTypes)[number];

export const BankingAccountCurrencies = ["USD", "EUR"] as const;
export type BankingAccountCurrency = (typeof BankingAccountCurrencies)[number];

export const BankingAccountStatus = ["OPEN", "CLOSED", "SUSPENDED"] as const;
export type BankingAccountStatus = (typeof BankingAccountStatus)[number];

export interface BankingAccount {
  id: number;
  customerId: number;
  alias: string;
  accountTransactions: BankingTransaction[];
  accountCards: BankingCard[];
  accountNumber: string;
  balance: number;
  accountType: BankingAccountType;
  accountCurrency: BankingAccountCurrency;
  accountStatus: BankingAccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
