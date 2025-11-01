export enum NotificationType {
  INFO = "INFO",
  MESSAGE = "MESSAGE",
  PENDING_ACTION = "PENDING_ACTION",
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  metadata: {
    username: string;
    cardId?: number;
    accountId?: number;
  };
  createdAt: Date;
}
