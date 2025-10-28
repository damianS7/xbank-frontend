<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import {
  BankingAccountCurrencies as currencies,
  BankingAccountTypes as accountTypes,
  type BankingAccountCurrency,
  type BankingAccountType,
} from "@/types/BankingAccount";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ref } from "vue";
const modalStore = useModalStore();

defineProps<{
  title?: string;
}>();

const account = ref({
  type: "CHECKING",
  currency: "USD",
});

function onSubmit() {
  modalStore.resolve(account.value);
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
    <div class="mb-4">
      <label class="block mb-1">Account type</label>
      <select v-model="account.type" class="w-full border rounded p-2">
        <option v-for="type in accountTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block mb-1">Currency</label>
      <select v-model="account.currency" class="w-full border rounded p-2">
        <option
          v-for="currency in currencies"
          :key="currency"
          :value="currency"
        >
          {{ currency }}
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
