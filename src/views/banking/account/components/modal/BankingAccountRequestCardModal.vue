<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";
import { cardOptions } from "@/types/BankingCard";
defineProps<{
  title?: string;
}>();

const modalStore = useModalStore();
const newCard = ref({
  type: "DEBIT",
});

function onSubmit() {
  modalStore.resolve(newCard.value.type);
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
    <div class="mb-4">
      <label class="block mb-1">Card type</label>
      <select v-model="newCard.type" class="w-full border rounded p-2">
        <option
          v-for="type in cardOptions"
          :key="type.label"
          :value="type.value"
        >
          {{ type.value }}
        </option>
      </select>
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
