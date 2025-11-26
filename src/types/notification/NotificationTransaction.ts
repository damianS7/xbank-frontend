import type { BankingTransaction } from "../BankingTransaction";
import type { NotificationType } from "./Notification";

export interface NotificationTransaction extends Notification {
  type: NotificationType.TRANSACTION;
  transaction: BankingTransaction;
}
