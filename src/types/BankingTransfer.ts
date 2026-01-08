import type { BankingTransaction } from "./BankingTransaction";

export enum BankingTransferStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}

export interface BankingTransfer {
  id: number;
  fromAccountId: number;
  toAccountNumber: string;
  amount: number;
  status: BankingTransferStatus;
  description: string;
  transaction: BankingTransaction;
  createdAt: Date;
  updatedAt: Date;
}
