import type { NotificationInfo } from "./NotificationInfo";
import type { NotificationTransaction } from "./NotificationTransaction";

export enum NotificationType {
  INFO = "INFO",
  TRANSACTION = "TRANSACTION",
}

export type Notification = NotificationTransaction | NotificationInfo;

export interface NotificationBase {
  id: number;
  createdAt: Date;
}
