<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import { useTransactionStore } from "@/stores/transaction";
import BankingCardTransactionList from "@/views/banking/card/components/BankingCardTransactionList.vue";
import { usePagination } from "@/composables/usePagination";

const props = defineProps<{
  cardId: number;
  currency: string;
}>();

const { nextPage, previousPage, currentPage, pagination } =
  usePagination(fetchTransactions);

const transactionStore = useTransactionStore();

async function fetchTransactions() {
  // if (pagination.value) {
  //   // check if the page its already fetched
  //   const pageFetched =
  //     pagination.value.pageable.pageNumber === currentPage.value;

  //   // if its fetched we assign to the paginator and prevents to fetch from endpoint
  //   if (pageFetched) {
  //     return;
  //   }
  // }
  return await transactionStore
    .fetchCardTransactions(props.cardId, currentPage.value, 6, true)
    .then((paginatedResponse: any) => {
      pagination.value = paginatedResponse;
    })
    .catch((error: any) => {
      console.error(error.message);
    });
}

onMounted(async () => {
  transactionStore.resetStore();
  await fetchTransactions();
});
</script>
<template>
  <BankingCardTransactionList
    v-if="transactionStore.transactions"
    :transactions="transactionStore.transactions"
    :currency="currency"
  />
  <div
    v-if="pagination && pagination.totalPages && pagination.totalPages > 0"
    class="flex items-center justify-end text-sm text-white bg-blue-600 p-1 rounded"
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
