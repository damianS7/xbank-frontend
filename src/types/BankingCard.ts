import type { BankingTransaction } from "./BankingTransaction";

// Banking Card Types
export const cardTypes = ["DEBIT", "CREDIT"] as const;
export type BankingCardType = (typeof cardTypes)[number];
export const cardOptions = cardTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1),
}));

// Banking Card Status
export const cardStatusValues = ["ENABLED", "DISABLED"] as const;
export type BankingCardStatus = (typeof cardStatusValues)[number];
export const cardStatusOptions = cardStatusValues.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1),
}));

// Banking Card Lock Status
export const cardLockStatusValues = ["UNLOCKED", "LOCKED"] as const;
export type BankingCardLockStatus = (typeof cardLockStatusValues)[number];
export const cardLockStatusOptions = cardLockStatusValues.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1),
}));

export interface BankingCard {
  id: number;
  bankingAccountId: number;
  cardNumber: string;
  cardCVV: string;
  cardPIN: string;
  currency: string;
  dailyLimit: number;
  expiredDate: Date;
  cardType: BankingCardType;
  cardStatus: BankingCardStatus;
  lockStatus: BankingCardLockStatus;
  transactions?: BankingTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
