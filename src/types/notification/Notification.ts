import type {
  BankingTransaction,
  BankingTransactionTypeEnum,
} from "../BankingTransaction";

export enum NotificationType {
  INFO = "INFO",
  TRANSACTION = "TRANSACTION",
  ALERT = "ALERT",
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  metadata: {
    transaction?: BankingTransaction;
    transferFrom?: string;
    transferTo?: string;
    // TODO delete from this metadata object in future
    cardId?: number;
    accountId?: number;
    amount?: number;
    currency?: string;
    transactionId?: number;
    transactionType?: BankingTransactionTypeEnum;
  };
  createdAt: Date;
}
