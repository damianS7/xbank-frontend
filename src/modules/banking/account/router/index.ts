import BankingAccountListView from "@/modules/banking/account/views/BankingAccountListView.vue";
import BankingAccountItemView from "@/modules/banking/account/views/BankingAccountItemView.vue";
export default [
  {
    path: "/banking/accounts",
    name: "banking-accounts",
    component: BankingAccountListView,
  },
  {
    path: "/banking/account/:id",
    name: "banking-account",
    component: BankingAccountItemView,
  },
];
