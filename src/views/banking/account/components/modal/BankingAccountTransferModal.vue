<script setup lang="ts">
import { ref, defineExpose } from "vue";
//MG03 4336 3953 2165 4585 8151
const visible = ref(false);
const transferData = ref({
  destinationAccount: "",
  amount: 10,
  description: "",
});

let _resolve: (value: object) => void;

// open modal
function open(): Promise<object> {
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  const accountNumber = transferData.value.destinationAccount.replace(
    /\s+/g,
    ""
  );

  _resolve({
    accountNumber,
    amount: transferData.value.amount,
    description: transferData.value.description,
  });
}

function cancel() {
  visible.value = false;
  _resolve({});
}
defineExpose({ open });
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Bank transfer</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Destiny account</label
          >
          <input
            v-model="transferData.destinationAccount"
            type="text"
            placeholder="Account number"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Amount</label
          >
          <input
            v-model.number="transferData.amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Description</label
          >
          <input
            v-model="transferData.description"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="cancel"
            class="bg-gray-300 rounded px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
