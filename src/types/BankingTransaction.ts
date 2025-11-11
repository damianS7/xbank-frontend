export enum BankingTransactionTypeEnum {
  CARD_CHARGE = "CARD_CHARGE",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER_FROM = "TRANSFER_FROM",
  TRANSFER_TO = "TRANSFER_TO",
}
export type BankingTransactionType = keyof typeof BankingTransactionTypeEnum;

export type BankingTransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface BankingTransaction {
  id: number;
  accountId: number;
  cardId?: number;
  amount: number;
  currency: string;
  lastBalance: number;
  transactionType: BankingTransactionType;
  transactionStatus: BankingTransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
