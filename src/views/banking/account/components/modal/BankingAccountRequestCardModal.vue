<script setup lang="ts">
import { ref, defineExpose } from "vue";
import { BankingCardType } from "@/types/BankingCard";
const visible = ref(false);
const cardTypes: BankingCardType[] = ["CREDIT", "DEBIT"];
const newCard = ref({
  type: "DEBIT",
});
let _resolve: (value: string) => void;

// open modal
function open(): Promise<string> {
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  _resolve(newCard.value.type);
}

function cancel() {
  visible.value = false;
  _resolve("");
}
defineExpose({ open });
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Card request</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Card type</label>
          <select v-model="newCard.type" class="w-full border rounded p-2">
            <option v-for="type in cardTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
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
