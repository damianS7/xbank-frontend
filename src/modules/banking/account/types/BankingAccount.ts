import type { BankingTransaction } from "@/modules/banking/transaction/types/BankingTransaction";
import type { BankingCard } from "@/modules/banking/card/types/BankingCard";

export const BankingAccountTypes = ["SAVINGS", "CHECKING"] as const;
export type BankingAccountType = (typeof BankingAccountTypes)[number];

export const BankingAccountCurrencies = ["USD", "EUR"] as const;
export type BankingAccountCurrency = (typeof BankingAccountCurrencies)[number];

export const BankingAccountStatus = [
  "PENDING_ACTIVATION",
  "ACTIVE",
  "CLOSED",
  "SUSPENDED",
] as const;
export type BankingAccountStatus = (typeof BankingAccountStatus)[number];

export interface BankingAccount {
  id: number;
  userId: number;
  alias: string;
  accountTransactions: BankingTransaction[];
  accountCards: BankingCard[];
  totalCards?: number;
  accountNumber: string;
  balance: number;
  reservedBalance: number;
  accountType: BankingAccountType;
  accountCurrency: BankingAccountCurrency;
  accountStatus: BankingAccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
