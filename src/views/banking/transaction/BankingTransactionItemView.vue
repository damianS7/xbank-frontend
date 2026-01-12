<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import CustomAlert from "@/components/CustomAlert.vue";
import { useTransactionStore } from "@/stores/transaction";
import Badge from "@/components/ui/badge/Badge.vue";
import PageLayout from "@/layouts/PageLayout.vue";
import {
  BankingTransactionType,
  type BankingTransaction,
} from "@/types/BankingTransaction";
import Spinner from "@/components/ui/spinner/Spinner.vue";

// ----

const route = useRoute();
const mountedComponent = ref(false);
const transactionStore = useTransactionStore();
const transactionId = parseInt(route.params.id as string, 10);
const transaction = ref<BankingTransaction | undefined>(undefined);

// alert
const alert = ref();

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatType(type: string): string {
  return type.replace("_FROM", "").replace("_TO", "").replace("_", " ");
}

onMounted(async () => {
  try {
    transaction.value = await transactionStore.fetchTransaction(transactionId);
  } catch (error: any) {}
  mountedComponent.value = true;
});
</script>
<template>
  <PageLayout>
    <template #header>
      <div
        class="flex flex-col justify-center sm:flex-row sm:justify-between items-center gap-2"
      >
        <h1>Banking Transaction</h1>
        <div v-if="transaction" class="flex flex-1 items-center gap-1">
          <Badge
            size="sm"
            :variant="
              transaction.status === 'COMPLETED'
                ? 'success'
                : ['PENDING', 'REJECTED'].includes(transaction?.status || '')
                  ? 'destructive'
                  : 'default'
            "
          >
            {{ transaction?.status }}
          </Badge>
          <Badge>{{ transaction?.type }}</Badge>
        </div>
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />
      <div v-if="transaction && mountedComponent" class="flex flex-col gap-4">
        <div class="bg-card text-card-foreground rounded-xl shadow p-6 w-full">
          <!-- Header: Title + Status -->
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-lg font-semibold">
                {{ formatType(transaction.type) }}
              </h2>
            </div>

            <div
              :class="[
                'text-2xl font-bold',
                transaction.amount > 0 ? '' : 'text-red-600',
              ]"
            >
              <span
                v-if="
                  transaction.type === BankingTransactionType.DEPOSIT ||
                  transaction.type === BankingTransactionType.TRANSFER_FROM
                "
                class="text-green-600"
              >
                +{{ transaction.amount.toFixed(2) }}
              </span>
              <span v-else class="text-red-600">
                -{{ transaction.amount.toFixed(2) }}
              </span>
              <span class="text-base font-normal ml-1">
                {{ transaction.currency || "" }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-border my-4"></div>

          <!-- Details -->
          <div class="grid gap-4 text-sm">
            <!-- Accounts -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex justify-between gap-2">
                <span class="font-medium text-muted-foreground">
                  From account:
                </span>
                <router-link
                  class="text-primary hover:underline break-all"
                  :to="{
                    name: 'banking-account',
                    params: { id: transaction.accountId },
                  }"
                >
                  ES00 0000 0000 1111 1111
                </router-link>
              </div>

              <div class="flex justify-between gap-2">
                <span class="font-medium text-muted-foreground">
                  To account:
                </span>
                <span class="break-all"> ES00 0000 0000 1111 2222 </span>
              </div>
            </div>

            <!-- Card -->
            <div v-if="transaction.cardId">
              <router-link
                class="flex justify-between gap-2 text-primary hover:underline"
                :to="{
                  name: 'banking-card',
                  params: { id: transaction.cardId },
                }"
              >
                <span class="font-medium text-muted-foreground">
                  Card ID:
                </span>
                <span>
                  {{ transaction.cardId }}
                </span>
              </router-link>
            </div>

            <!-- Balances -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex justify-between gap-2">
                <span class="font-medium text-muted-foreground">
                  Balance before:
                </span>
                <span>
                  {{ transaction.balanceBefore.toFixed(2) }}
                </span>
              </div>

              <div class="flex justify-between gap-2">
                <span class="font-medium text-muted-foreground">
                  Balance after:
                </span>
                <span>
                  {{ transaction.balanceAfter.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Created -->
            <div class="flex justify-between gap-2">
              <span class="font-medium text-muted-foreground"> Created: </span>
              <span>
                {{ formatDate(transaction.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!transaction && !mountedComponent"
        class="flex text-gray-600 text-center justify-center items-center gap-2"
      >
        <Spinner class="text-primary" /> Loading transaction ...
      </div>

      <div
        v-else-if="!transaction && mountedComponent"
        class="text-gray-600 text-center"
      >
        No transaction found ...
      </div>
    </template>
  </PageLayout>
</template>
