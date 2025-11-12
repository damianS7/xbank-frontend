<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import CustomAlert from "@/components/CustomAlert.vue";
import { useTransactionStore } from "@/stores/transaction";
import Badge from "@/components/ui/badge/Badge.vue";
import PageLayout from "@/layouts/PageLayout.vue";
import type { BankingTransaction } from "@/types/BankingTransaction";
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
              transaction.transactionStatus === 'COMPLETED'
                ? 'success'
                : ['PENDING', 'REJECTED'].includes(
                      transaction?.transactionStatus || ''
                    )
                  ? 'destructive'
                  : 'default'
            "
          >
            {{ transaction?.transactionStatus }}
          </Badge>
          <Badge>{{ transaction?.transactionType }}</Badge>
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
                {{ transaction.description || "Transaction" }}
              </h2>
              <p class="text-sm text-muted-foreground">
                {{ formatType(transaction.transactionType) }}
                <span v-if="transaction.transactionStatus">
                  <Badge
                    :variant="
                      transaction.transactionStatus === 'COMPLETED'
                        ? 'success'
                        : 'secondary'
                    "
                  >
                    {{ transaction.transactionStatus }} @
                    {{ formatDate(transaction.updatedAt) }}
                  </Badge>
                </span>
              </p>
            </div>

            <div
              :class="[
                'text-2xl font-bold',
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ transaction.amount.toFixed(2) }}
              <span class="text-base font-normal ml-1">
                {{ transaction.currency || "USD" }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-border my-4"></div>

          <!-- Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <router-link
                :to="{
                  name: 'banking-account',
                  params: { id: transaction.accountId },
                }"
              >
                <span class="font-medium text-muted-foreground"
                  >Account ID:</span
                >
                <span class="ml-2">{{ transaction.accountId }}</span>
              </router-link>
            </div>

            <div v-if="transaction.cardId">
              <router-link
                :to="{
                  name: 'banking-card',
                  params: { id: transaction.cardId },
                }"
              >
                <span class="font-medium text-muted-foreground">Card ID:</span>
                <span class="ml-2">{{ transaction.cardId }}</span>
              </router-link>
            </div>

            <div>
              <span class="font-medium text-muted-foreground"
                >Balance after:</span
              >
              <span class="ml-2">{{ transaction.lastBalance.toFixed(2) }}</span>
            </div>

            <div>
              <span class="font-medium text-muted-foreground">Created:</span>
              <span class="ml-2">
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
