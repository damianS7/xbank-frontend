<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { computed } from "vue";
import { BankingAccountCurrencies as currencies } from "@/types/BankingAccount";
import BankingAccountCurrencyChart from "@/views/home/BankingAccountCurrencyChart.vue";

const accountStore = useAccountStore();
const accounts = computed(() => accountStore.bankingAccounts);

function totalBalance(currency: string) {
  return accounts.value.reduce((total, account) => {
    return account.accountCurrency === currency
      ? total + account.balance
      : total;
  }, 0);
}
</script>
<template>
  <div v-if="accounts" class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 dash-item-group">
      <h3 class="font-semibold md:col-span-2">Summary</h3>

      <!-- Accounts and Cards -->
      <div class="flex justify-between dash-item">
        <span>Accounts</span>
        <span>{{ accountStore.countAccounts }}</span>
      </div>
      <div class="flex justify-between dash-item">
        <span>Cards</span>
        <span>{{ accountStore.countCards }}</span>
      </div>
    </div>

    <!-- Balance -->
    <div class="grid grid-cols-1 md:grid-cols-2 dash-item-group">
      <h3 class="font-semibold md:col-span-2">Account balances</h3>
      <div
        v-for="(currency, index) in currencies"
        :key="index"
        class="flex flex-col my-1 p-1 rounded"
      >
        <div>
          <BankingAccountCurrencyChart :currency="currency" />
        </div>
        <div class="flex justify-between mt-4 text-sm dash-item">
          <span>Total</span>
          <span class="text-green-600 justify-end">
            {{ totalBalance(currency) }} {{ currency }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference "tailwindcss";

.dash-item-group {
  @apply bg-gray-50 gap-4 p-4 shadow rounded;
}

.dash-item {
  @apply bg-gray-200 gap-4 p-4 shadow rounded;
}
</style>
