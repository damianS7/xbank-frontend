<script setup lang="ts">
import { ref } from "vue";

interface PendingTransaction {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
}

// message to show
const alert = ref();

const pendingTransactions = ref<PendingTransaction[]>([
  {
    id: 1,
    description: "Transfer to John Doe",
    amount: 250.5,
    createdAt: "2025-06-05T10:00:00Z",
  },
  {
    id: 2,
    description: "Payment to ABC Corp",
    amount: 1000,
    createdAt: "2025-06-06T14:30:00Z",
  },
]);

function approve(id: number) {
  console.log("Approved:", id);
  // Lógica para aprobar (por ahora eliminamos localmente)
  pendingTransactions.value = pendingTransactions.value.filter(
    (t) => t.id !== id
  );
}

function reject(id: number) {
  console.log("Rejected:", id);
  // Lógica para rechazar (por ahora eliminamos localmente)
  pendingTransactions.value = pendingTransactions.value.filter(
    (t) => t.id !== id
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB");
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
</script>
<template>
  <div class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2"
    >
      <h1>Pending Transactions</h1>
    </section>

    <section
      v-if="pendingTransactions.length"
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert ref="alert" />
      <table class="w-full table-auto border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border text-left">Date</th>
            <th class="p-2 border text-left">Description</th>
            <th class="p-2 border text-right">Amount</th>
            <th class="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in pendingTransactions"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="p-2 border">{{ formatDate(transaction.createdAt) }}</td>
            <td class="p-2 border">{{ transaction.description }}</td>
            <td class="p-2 border text-right">
              {{ formatAmount(transaction.amount) }}
            </td>
            <td class="p-2 border text-center space-x-2">
              <button
                class="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                @click="approve(transaction.id)"
              >
                Approve
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                @click="reject(transaction.id)"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-else class="text-gray-500 text-center">
      No pending transactions.
    </section>
  </div>
</template>
