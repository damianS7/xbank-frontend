import type { BankingTransaction } from "./BankingTransaction";

export enum BankingTransferStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}

export interface BankingTransfer {
  id: number;
  accountId: number;
  toAccountNumber: string;
  amount: number;
  currency: string;
  status: BankingTransferStatus;
  description: string;
  transaction: BankingTransaction;
  createdAt: Date;
  updatedAt: Date;
}
