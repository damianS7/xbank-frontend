export enum BankingTransactionType {
  CARD_CHARGE = "CARD_CHARGE",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER_FROM = "TRANSFER_FROM",
  TRANSFER_TO = "TRANSFER_TO",
}

export enum BankingTransactionStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface BankingTransaction {
  id: number;
  accountId: number;
  fromUser?: string;
  fromAccountNumber?: string;
  toUser?: string;
  toAccountNumber?: string;
  cardId?: number;
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  type: BankingTransactionType;
  status: BankingTransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
