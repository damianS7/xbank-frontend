import type { BankingTransaction } from "../BankingTransaction";
import type { NotificationBase, NotificationType } from "./NotificationBase";

export interface NotificationTransaction extends NotificationBase {
  type: NotificationType.TRANSACTION;
  metadata: {
    transaction: BankingTransaction;
  };
}
