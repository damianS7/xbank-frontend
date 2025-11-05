<script setup lang="ts">
import { defineProps } from "vue";
import type { BankingTransaction } from "@/types/BankingTransaction";

defineProps<{
  transactions: BankingTransaction[];
  currency: string;
}>();
</script>
<template>
  <div class="p-4 bg-white rounded shadow w-full">
    <h3 class="sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
      Transactions
    </h3>
    <ul v-if="transactions?.length > 0" class="space-y-2">
      <li
        v-for="(transaction, index) in transactions"
        :key="index"
        class="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 hover:bg-gray-100 p-3 rounded-md"
      >
        <div class="flex flex-col text-sm font-medium text-left">
          <span>{{ transaction.description }}</span>
          <span class="text-xs pill-xs pill-blue w-fit">
            {{ transaction.transactionType.replace(/_/g, " ") }}</span
          >
        </div>

        <div class="flex flex-col text-sm font-medium text-right sm:w-1/2">
          <span
            v-if="
              ['DEPOSIT', 'TRANSFER_FROM'].includes(transaction.transactionType)
            "
            class="text-green-600"
          >
            +{{ transaction.amount }} {{ currency }}
          </span>
          <span v-else class="text-red-600">
            -{{ transaction.amount }} {{ currency }}
          </span>
          <span class="text-xs text-gray-500">
            {{
              new Date(transaction.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </span>
        </div>
      </li>
    </ul>
    <div v-else class="text-center text-gray-500">No transactions found.</div>
  </div>
</template>
