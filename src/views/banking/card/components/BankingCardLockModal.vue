<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";

const visible = ref(false);

const props = defineProps({
  cardEnabled: {
    type: Boolean,
    required: true,
  },
});

let _resolve: (value: boolean) => void;

// open modal
function open(): Promise<boolean> {
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  _resolve(true);
}

function cancel() {
  visible.value = false;
  _resolve(false);
}

defineExpose({ open });
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Locking card</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <p>
            You are about to
            <b>{{ props.cardEnabled ? "enable" : "disable" }}</b> this card.
          </p>
          <p>Are you sure?</p>
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
