export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  TRANSFER = "TRANSFER",
  CARD = "CARD",
  ACCOUNT = "ACCOUNT",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  HEARTBEAT = "HEARTBEAT",
}

export interface Notification {
  id: number;
  type: NotificationType;
  payload: Record<string, any>;
  templateKey: string;
  createdAt: Date;
}

export function mapNotification(raw: any): Notification {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
  };
}
