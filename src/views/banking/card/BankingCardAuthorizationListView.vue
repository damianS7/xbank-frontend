<script setup lang="ts">
import { computed, ref } from "vue";
import PageLayout from "@/layouts/PageLayout.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import type { BadgeVariants } from "@/components/ui/badge";
import { useTransferStore } from "@/stores/transfer";
import {
  BankingTransferStatus,
  type BankingTransfer,
} from "@/types/BankingTransfer";
// import {
// BankingTransactionStatus,
// type BankingTransaction,
// } from "@/types/BankingTransaction";
import { useModalStore } from "@/stores/modal";

// ---

// message to show
const alert = ref();

// modals to show
const modalStore = useModalStore();

// store
const transferStore = useTransferStore();

const transfers = computed<BankingTransfer[]>(
  () => transferStore.transfersSortedByDate
);

const STATUS_VARIANT_MAP: Record<BankingTransferStatus, BadgeVariants> = {
  [BankingTransferStatus.PENDING]: { variant: "alert" },
  [BankingTransferStatus.REJECTED]: { variant: "destructive" },
  [BankingTransferStatus.CONFIRMED]: { variant: "success" },
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
      alert.value.exception(error.message);
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
      alert.value.exception(error.message);
    });
}
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Card authorizations</h1>
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
              {{ transfer.amount.toFixed(2) }}
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
