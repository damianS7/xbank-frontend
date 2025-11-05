<script setup lang="ts">
import { computed, defineProps, onMounted, ref, type Ref } from "vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";
import { useTransactionStore } from "@/stores/transaction";
import BankingCardTransactionList from "@/views/banking/card/components/BankingCardTransactionList.vue";

const props = defineProps<{
  cardId: number;
  currency: string;
}>();

const transactionStore = useTransactionStore();

// pagination
const currentPage = ref(0); // Spring usa 0-indexed
const pagination: Ref<PaginatedResponse> = computed(() => {
  return transactionStore.pagination;
}) as Ref<PaginatedResponse>;

function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchTransactions();
  }
}

function nextPage() {
  if (currentPage.value < pagination.value?.totalPages - 1) {
    currentPage.value++;
    fetchTransactions();
  }
}

onMounted(async () => {
  await fetchTransactions();
});
async function fetchTransactions() {
  // if (transactionStore.pagination) {
  //   // check if the page its already fetched
  //   const pageFetched =
  //     pagination.value.pageable.pageNumber === currentPage.value;

  //   // if its fetched we assign to the paginator and prevents to fetch from endpoint
  //   if (pageFetched) {
  //     return;
  //   }
  // }
  return await transactionStore
    .fetchCardTransactions(props.cardId, currentPage.value, 2)
    .catch((error: any) => {
      console.error(error.message);
    });
}
</script>
<template>
  <BankingCardTransactionList
    v-if="transactionStore.transactions"
    :transactions="transactionStore.transactions"
    :currency="currency"
  />
  <div
    v-if="pagination && pagination.totalPages && pagination.totalPages > 0"
    class="flex items-center justify-end text-sm mt-4 text-white bg-blue-600 p-1 rounded"
  >
    <button class="mx-2 rounded-md">
      <ChevronLeft @click="previousPage" class="cursor-pointer" />
    </button>
    <span>
      {{ pagination.pageable?.pageNumber + 1 }} /
      {{ pagination.totalPages }}
    </span>
    <button class="mx-2 rounded-md">
      <ChevronRight @click="nextPage" class="cursor-pointer" />
    </button>
  </div>
</template>
