<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Badge from "@/components/ui/badge/Badge.vue";
import PageLayout from "@/layouts/PageLayout.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import {
  OperationStatus,
  OperationType,
  type Operation,
} from "@/types/Operation";
import { useOperationsStore } from "@/stores/operations";
import { useModalStore } from "@/stores/modal";

// store
const operationStore = useOperationsStore();

// modals to show
const modalStore = useModalStore();

// message to show
const alert = ref();

const operations = computed<Operation[]>(() => operationStore.getOperations());
const STATUS_VARIANT_MAP: Record<OperationStatus, string> = {
  [OperationStatus.PENDING]: "alert",
  [OperationStatus.REJECTED]: "destructive",
  [OperationStatus.CONFIRMED]: "success",
};

async function doAction(id: number, action: string, type: OperationType) {
  const confirm: string = (await modalStore.open("ConfirmMessage", {
    title: action.toUpperCase() + " " + type,
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

  if (action === "approve") {
    approve(id, type, password);
  }

  if (action === "reject") {
    reject(id, type, password);
  }
}

async function approve(id: number, type: OperationType, password: string) {
  if (type === OperationType.TRANSFER) {
    await operationStore
      .approveTransfer(id, password)
      .then((transfer) => {
        alert.value.success("Operation aprroved.");
      })
      .catch((error) => {
        alert.value.exception(error.message);
      });
  }
}

async function reject(id: number, type: OperationType, password: string) {
  if (type === OperationType.TRANSFER) {
    await operationStore
      .rejectTransfer(id, password)
      .then((transfer) => {
        alert.value.success("Operation rejected.");
      })
      .catch((error) => {
        alert.value.exception(error.message);
      });
  }
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
onMounted(() => {});
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Pending Operations</h1>
    </template>

    <template #content>
      <CustomAlert ref="alert" />
      <table v-if="operations.length" class="w-full table-auto border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border text-left">Date</th>
            <th class="p-2 border text-left">Status</th>
            <th class="p-2 border text-left">Description</th>
            <th class="p-2 border text-right">Amount</th>
            <th class="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(operation, index) in operations"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="p-2 border">
              {{ operation.createdAt.toLocaleString() }}
            </td>
            <td class="p-2 border">
              <Badge :variant="STATUS_VARIANT_MAP[operation.status]">
                {{ operation.status }}
              </Badge>
            </td>
            <td class="p-2 border">{{ operation.type }}</td>
            <td class="p-2 border text-right">
              {{ formatAmount(operation.amount) }}
            </td>
            <td class="p-2 border text-center space-x-2">
              <slot v-if="operation.status === OperationStatus.PENDING">
                <button
                  class="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  @click="doAction(operation.id, 'approve', operation.type)"
                >
                  Approve
                </button>
                <button
                  class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  @click="doAction(operation.id, 'reject', operation.type)"
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
