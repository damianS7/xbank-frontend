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
const modalStore = useModalStore();

defineProps<{
  title?: string;
}>();

const dailyLimitField = ref("");

function onSubmit() {
  if (dailyLimitField.value.length === 0) {
    return;
  }

  modalStore.resolve(dailyLimitField.value);
}
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
    <div class="mb-4">
      <label class="block mb-1">Daily limit</label>
      <input
        type="number"
        step="100"
        min="100"
        max="9999"
        class="border rounded p-2 w-full"
        v-model="dailyLimitField"
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
