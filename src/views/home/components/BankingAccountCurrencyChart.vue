<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { computed, defineProps, onMounted, ref } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import type { BankingTransaction } from "@/types/BankingTransaction";
import { LineChart } from "@/components/ui/chart-line";

const props = defineProps({
  currency: {
    type: String,
    required: true,
  },
});

// store
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

// data
const accounts = computed(() => accountStore.bankingAccounts);
const transactions = ref<BankingTransaction[]>([]);

const data = computed(() =>
  transactions.value.map((transaction) => {
    const date = new Date(transaction.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    // const formattedDate = `${year}-${month}-${day}`;

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return {
      date: formattedDate, // x axis
      Balance: transaction.lastBalance, // categoría (nombre visible)
    };
  })
);

async function fetchAllTransactions() {
  const result: BankingTransaction[] = [];
  const accountsByCurrency = accounts.value.filter((account) => {
    if (account.accountCurrency === props.currency) return account;
  });

  for (const account of accountsByCurrency) {
    await transactionStore
      .fetchAccountTransactions(account.id, 0, 100)
      .then((transactions: any) => {
        result.push(...transactions);
      });
  }
  return result;
}

onMounted(async () => {
  const data = await fetchAllTransactions();
  transactions.value = data.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
});
</script>
<template>
  <LineChart
    v-if="transactions"
    index="date"
    :data="data"
    :show-legend="false"
    :categories="['Balance']"
    :colors="['blue', 'red']"
  />
</template>
<style scoped>
.unovis .label,
.unovis text {
  font-size: 6px !important;
}
</style>
