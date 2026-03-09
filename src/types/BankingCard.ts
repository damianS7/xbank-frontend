import type { BankingTransaction } from "./BankingTransaction";

// Banking Card Types
export const cardTypes = ["DEBIT", "CREDIT"] as const;
export type BankingCardType = (typeof cardTypes)[number];
export const cardOptions = cardTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1),
}));

// Banking Card Status
export const cardStatusValues = [
  "ACTIVE",
  "DISABLED",
  "LOCKED",
  "EXPIRED",
  "PENDING_ACTIVATION",
] as const;
export type BankingCardStatus = (typeof cardStatusValues)[number];
export const cardStatusOptions = cardStatusValues.map((value) => ({
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
  expirationYear: number;
  expirationMonth: number;
  cardType: BankingCardType;
  cardStatus: BankingCardStatus;
  transactions?: BankingTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export function mapToCard(card: any): BankingCard {
  return {
    ...card,
    expiredDate: new Date(card.expiredDate),
    createdAt: new Date(card.createdAt),
    updatedAt: new Date(card.updatedAt),
  };
}
