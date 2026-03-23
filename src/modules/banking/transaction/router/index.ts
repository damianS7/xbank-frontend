import BankingTransactionItemView from "@/modules/banking/transaction/views/BankingTransactionItemView.vue";

export default [
  {
    path: "/banking/transactions/:id",
    name: "banking-transaction",
    component: BankingTransactionItemView,
  },
];
