export interface Setting {
  emailNotifications: boolean;
  appNotifications: boolean;
  multifactor: boolean;
  multifactorMethod: string;
  language: string;
  theme: string;
  signOperations: boolean;
  signOperationsPIN: string;
  sessionTimeout: number;
}
