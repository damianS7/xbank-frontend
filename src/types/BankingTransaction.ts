export type BankingTransactionType =
  | "CARD_CHARGE"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER_FROM"
  | "TRANSFER_TO";
export type BankingTransactionStatus = "PENDING" | "COMPLETED" | "FAILED"; // Ajusta también si es necesario

export interface BankingTransaction {
  id: number;
  accountId: number;
  cardId?: number;
  amount: number;
  accountBalance: number;
  transactionType: BankingTransactionType;
  transactionStatus: BankingTransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
