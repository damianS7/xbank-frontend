import type { BankingTransaction } from "@/modules/banking/transaction/types/BankingTransaction";

export enum BankingTransferStatus {
  PENDING = "PENDING",
  AUTHORIZED = "AUTHORIZED",
  COMPLETED = "COMPLETED",
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
