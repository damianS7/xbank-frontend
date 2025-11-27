import type { NotificationBase, NotificationType } from "./NotificationBase";

export interface NotificationInfo extends NotificationBase {
  type: NotificationType.INFO;
  metadata: {
    message: string;
  };
}
