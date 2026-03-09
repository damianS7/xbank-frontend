<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import PageLayout from "@/layouts/PageLayout.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import { useTransferStore } from "@/stores/transfer";
import { useModalStore } from "@/stores/modal";
import type { BadgeVariants } from "@/components/ui/badge";
import {
  BankingTransferStatus,
  type BankingTransfer,
} from "@/types/BankingTransfer";

// composables
import { useScrollBottonDetect } from "@/composables/useScrollBottomDetect";
import { usePagination } from "@/composables/usePagination";

// store
const transferStore = useTransferStore();

// modals to show
const modalStore = useModalStore();

// message to show
const alert = ref();

const transfers = computed<BankingTransfer[]>(
  () => transferStore.transfersSortedByDate
);

const STATUS_VARIANT_MAP: Record<BankingTransferStatus, BadgeVariants> = {
  [BankingTransferStatus.PENDING]: { variant: "alert" },
  [BankingTransferStatus.REJECTED]: { variant: "destructive" },
  [BankingTransferStatus.AUTHORIZED]: { variant: "default" },
  [BankingTransferStatus.COMPLETED]: { variant: "success" },
  [BankingTransferStatus.CONFIRMED]: { variant: "default" },
};
async function doAction(action: string) {
  const confirm: string = (await modalStore.open("ConfirmMessage", {
    title: action.toUpperCase() + " transfer",
    message: "Do you wish to " + action.toUpperCase() + " this operation?",
  })) as string;

  // if modal is cancelled ...
  if (!confirm) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm password",
  })) as string;

  // if password modal is cancelled ...
  if (!password) {
    return;
  }

  return password;
}

async function approve(id: number) {
  const password = await doAction("approve");
  if (!password) {
    return;
  }

  await transferStore
    .approveTransfer(id, password)
    .then((_transfer) => {
      alert.value.success("Operation aprroved.", { timeout: 5 });
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

async function reject(id: number) {
  const password = await doAction("reject");
  if (!password) {
    return;
  }

  await transferStore
    .rejectTransfer(id, password)
    .then((_transfer) => {
      alert.value.success("Operation rejected.", { timeout: 5 });
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

function formatAmount(amount: number): string {
  return `${amount.toFixed(2)}`;
}

// methods
async function doOnBottom() {
  if (
    pagination.value &&
    pagination.value.totalPages &&
    currentPage.value >= pagination.value.totalPages - 1
  ) {
    return;
  }
  // next page
  nextPage();
}

// pagination
const transferScroll: Ref<HTMLDivElement | HTMLElement | null> = ref(null);

// HTMLDivElement
const { currentPage, nextPage, pagination, previousPage } = usePagination(() =>
  transferStore.fetchTransfers(currentPage.value)
);

useScrollBottonDetect(transferScroll, doOnBottom);

onMounted(async () => {
  // notificationStore.resetStore();
  // await fetchNotifications();
  // await transferStore.initialize();
  pagination.value = transferStore.pagination;
  transferScroll.value = document.getElementById("page-section-content");
  // mountedComponent.value = true;
});
</script>
<template>
  <PageLayout>
    <template #header>
      <div class="flex items-center justify-between">
        <h1>Transfers</h1>
        <div
          class="flex items-center p-1 text-white bg-blue-300 rounded text-xs gap-2"
        >
          <Button
            size="xs"
            class="rounded-sm bg-blue-400"
            @click="previousPage()"
          >
            <ChevronLeft />
          </Button>
          <span> {{ currentPage + 1 }} / {{ pagination?.totalPages }} </span>
          <Button size="xs" class="rounded-sm bg-blue-400" @click="nextPage">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </template>
    <template #content>
      <CustomAlert ref="alert" />
      <table v-if="transfers.length" class="w-full table-auto border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border text-left">Date</th>
            <th class="p-2 border text-left">Status</th>
            <th class="p-2 border text-left">To account</th>
            <th class="p-2 border text-right">Amount</th>
            <th class="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- TODO paginate -->
          <tr
            v-for="(transfer, index) in transfers"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="p-2 border">
              {{ transfer.createdAt.toLocaleString() }}
            </td>
            <td class="p-2 border">
              <Badge :variant="STATUS_VARIANT_MAP[transfer.status].variant">
                {{ transfer.status }}
              </Badge>
            </td>
            <td class="p-2 border">{{ transfer.toAccountNumber }}</td>
            <td class="p-2 border text-right">
              {{ formatAmount(transfer.amount) }}
            </td>
            <td class="p-2 border text-center space-x-2">
              <slot v-if="transfer.status === BankingTransferStatus.PENDING">
                <button
                  class="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  @click="approve(transfer.id)"
                >
                  Approve
                </button>
                <button
                  class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  @click="reject(transfer.id)"
                >
                  Reject
                </button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-gray-600 text-center">
        No pending transactions.
      </div>
    </template>
  </PageLayout>
</template>
