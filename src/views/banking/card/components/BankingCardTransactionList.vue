<script setup lang="ts">
import { defineProps } from "vue";
import type { BankingTransaction } from "@/types/BankingTransaction";
import Badge from "@/components/ui/badge/Badge.vue";

defineProps<{
  transactions: BankingTransaction[];
  currency: string;
}>();
</script>
<template>
  <div class="flex flex-col gap-4 p-4 bg-white rounded shadow w-full">
    <h3 class="sm:text-lg font-semibold text-gray-800 border-b pb-2">
      Transactions
    </h3>
    <ul v-if="transactions?.length > 0" class="flex flex-col gap-2">
      <router-link
        v-for="(transaction, index) in transactions"
        :key="index"
        :to="{
          name: 'banking-transaction',
          params: { id: transaction.id },
        }"
      >
        <li
          class="grid grid-cols-1 items-center gap-2 bg-gray-50 hover:bg-gray-100 p-3 rounded-md"
        >
          <div
            class="flex justify-between gap-1 items-center text-sm font-medium"
          >
            <span class="flex gap-1">
              <span>{{ transaction.description }}</span>
            </span>
            <span
              v-if="['CARD_CHARGE', 'WITHDRAWAL'].includes(transaction.type)"
              class="text-red-600"
            >
              -{{ transaction.amount }} {{ currency }}
            </span>
          </div>

          <div
            class="flex flex-col sm:flex-row text-sm font-medium justify-between items-center"
          >
            <span class="flex gap-1 items-center">
              <Badge variant="default">
                {{ transaction.type.replace(/_/g, " ") }}</Badge
              >
              <Badge
                :variant="
                  transaction.status === 'COMPLETED'
                    ? 'success'
                    : transaction.status === 'PENDING'
                      ? 'alert'
                      : transaction.status === 'FAILED'
                        ? 'destructive'
                        : 'default'
                "
              >
                {{ transaction.status }}
              </Badge>
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
      </router-link>
    </ul>
    <div v-else class="text-center text-gray-500">No transactions found.</div>
  </div>
</template>
