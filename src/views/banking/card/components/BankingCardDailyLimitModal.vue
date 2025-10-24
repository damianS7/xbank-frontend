<script setup lang="ts">
import { ref, defineExpose } from "vue";

const visible = ref(false);
const dailyLimitField = ref("");

let _resolve: (value: string) => void;

// open modal
function open(): Promise<string> {
  visible.value = true;
  dailyLimitField.value = "";

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  if (dailyLimitField.value.length === 0) {
    return;
  }

  visible.value = false;
  _resolve(dailyLimitField.value);
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
      <h2 class="text-xl font-semibold mb-4">Card daily limit</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Daily limit</label>
          <input
            type="text"
            class="border rounded p-2 w-full"
            v-model="dailyLimitField"
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
