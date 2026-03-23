import BankingCardListView from "@/modules/banking/card/views/BankingCardListView.vue";
import BankingCardItemView from "@/modules/banking/card/views/BankingCardItemView.vue";
export default [
  {
    path: "/banking/cards",
    name: "banking-cards",
    component: BankingCardListView,
  },
  {
    path: "/banking/card/:id",
    name: "banking-card",
    component: BankingCardItemView,
  },
];
