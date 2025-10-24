<script setup lang="ts">
import { ref, defineExpose } from "vue";

const visible = ref(false);
const password = ref("");
const repeatedPassword = ref("");
let _resolve: (value: string) => void;

// open modal
function open(): Promise<string> {
  visible.value = true;
  password.value = "";
  repeatedPassword.value = "";

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  if (password.value !== repeatedPassword.value) {
    return;
  }

  visible.value = false;
  _resolve(password.value);
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
      <h2 class="text-xl font-semibold mb-4">Establecer nuevo PIN</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Nuevo PIN</label>
          <input
            type="password"
            class="border rounded p-2 w-full"
            v-model="password"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1">Repetir PIN</label>
          <input
            type="password"
            class="border rounded p-2 w-full"
            v-model="repeatedPassword"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="cancel"
            class="bg-gray-300 rounded px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
