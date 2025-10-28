import type { BankingAccountType } from "@/types/BankingAccount";
import type { BankingAccountCurrency } from "@/types/BankingAccount";
export interface BankingAccountCreateRequest {
  type: BankingAccountType;
  currency: BankingAccountCurrency;
}
