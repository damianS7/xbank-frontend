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

const password = ref("");
const repeatedPassword = ref("");

function onSubmit() {
  if (password.value !== repeatedPassword.value) {
    return;
  }

  modalStore.resolve(password.value);
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
    <div class="mb-4">
      <label class="block mb-1">Set PIN</label>
      <input
        type="password"
        class="border rounded p-2 w-full"
        v-model="password"
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Repeat PIN</label>
      <input
        type="password"
        class="border rounded p-2 w-full"
        v-model="repeatedPassword"
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
