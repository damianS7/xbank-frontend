<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const modalStore = useModalStore();
const transferData = ref({
  destinationAccount: "",
  amount: 10,
  description: "",
});

defineProps<{
  title?: string;
}>();

function onSubmit() {
  const accountNumber = transferData.value.destinationAccount.replace(
    /\s+/g,
    ""
  );
  modalStore.resolve({
    accountNumber,
    amount: transferData.value.amount,
    description: transferData.value.description,
  });
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
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
      <label class="block mb-1 text-sm font-medium text-gray-700">Amount</label>
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
    <DialogFooter>
      <form @submit.prevent="onSubmit" class="flex gap-2">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button type="submit">Submit</Button>
      </form>
    </DialogFooter>
  </DialogContent>
</template>
