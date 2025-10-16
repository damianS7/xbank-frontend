import type { BankingTransaction } from "./BankingTransaction";

export type BankingCardType = "DEBIT" | "CREDIT";
export type BankingCardStatus = "ENABLED" | "DISABLED";
export type BankingCardLockStatus = "UNLOCKED" | "LOCKED";

export interface BankingCard {
  id: number;
  bankingAccountId: number; // o puedes usar BankingAccount si necesitas toda la info
  cardNumber: string;
  cardCVV: string;
  cardPIN: string;
  dailyLimit: number;
  expiredDate: Date;
  cardType: BankingCardType;
  cardStatus: BankingCardStatus;
  lockStatus: BankingCardLockStatus;
  transactions?: BankingTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
