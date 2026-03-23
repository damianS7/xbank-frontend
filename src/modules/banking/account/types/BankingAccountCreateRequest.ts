import type { BankingAccountType } from "./BankingAccount";
import type { BankingAccountCurrency } from "./BankingAccount";
export interface BankingAccountCreateRequest {
  type: BankingAccountType;
  currency: BankingAccountCurrency;
}
