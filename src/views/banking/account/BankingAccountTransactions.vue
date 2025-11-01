<script setup lang="ts">
import { computed, onMounted, ref, type PropType, type Ref } from "vue";
import { defineProps } from "vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import { useTransactionStore } from "@/stores/transaction";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  currency: { type: String, required: true },
  fetch: {
    type: Function as PropType<
      (id: number, page: number, size: number) => Promise<any>
    >,
    required: true,
  },
});

// store
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

async function fetchTransactions() {
  if (transactionStore.pagination) {
    // check if the page its already fetched
    const pageFetched =
      pagination.value.pageable.pageNumber === currentPage.value;

    // if its fetched we assign to the paginator and prevents to fetch from endpoint
    if (pageFetched) {
      return;
    }
  }

  return await props
    .fetch(props.id, currentPage.value, 2)
    .catch((error: any) => {
      console.error(error.message);
    });
}

onMounted(() => {
  if (!props.id) {
    return;
  }
  fetchTransactions();
  // isViewReady.value = true;
});
</script>
<template>
  <div v-if="pagination">
    <div class="p-4 bg-white rounded shadow w-full">
      <h3 class="sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Transactions
      </h3>
      <ul v-if="pagination.content?.length > 0" class="space-y-2">
        <li
          v-for="(transaction, index) in pagination.content"
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
                ['DEPOSIT', 'TRANSFER_FROM'].includes(
                  transaction.transactionType
                )
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
      <div
        v-if="pagination.totalPages > 0"
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
    </div>
  </div>
</template>
