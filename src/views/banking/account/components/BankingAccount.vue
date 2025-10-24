<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import { useCardStore } from "@/stores/card";
import { CreditCard, SquarePen, Save, SaveOff } from "lucide-vue-next";
import { useAccountStore } from "@/stores/account";
const emit = defineEmits(["update"]);
const cardStore = useCardStore();
const accountStore = useAccountStore();
const props = defineProps<{
  id: number;
  editable?: boolean;
}>();

const account = computed(() => accountStore.getBankingAccount(props.id));

const formFields = ref({
  name: "alias",
  type: "text",
  placeholder: "Alias",
  value: account.value?.alias,
  error: "",
  isEditing: false,
  edited: false,
});

function saveAlias() {
  formFields.value.isEditing = false;
  emit("update", formFields.value.value);
}

function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}
</script>
<template>
  <div v-if="account" class="bg-gray-50 p-4 rounded-xl shadow mt-6 w-full">
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
    >
      <span class="text-sm sm:text-base font-semibold text-gray-800 break-all">
        IBAN {{ formatIban(account.accountNumber) }}
      </span>

      <div class="flex flex-wrap gap-1">
        <span
          class="relative flex items-center gap-1 pill pill-blue group cursor-pointer"
        >
          {{ cardStore.countCardsByAccount(account.id) }}
          <CreditCard />
          <span
            class="absolute top-full left-1/2 -translate-x-1/2 mt-1 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap"
          >
            Total cards for this account
          </span>
        </span>
        <span class="pill pill-blue">{{ account.accountType }}</span>
        <span class="pill pill-blue">{{ account.accountStatus }}</span>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4"
    >
      <!-- Alias -->
      <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
        <div>
          <div v-if="!formFields.isEditing" class="flex gap-1">
            {{ account.alias || "" }}
            <SquarePen
              @click="formFields.isEditing = true"
              v-if="editable"
              class="cursor-pointer"
            />
          </div>
          <div class="flex gap-1 items-center" v-else>
            <input type="text" class="w-auto p-1" v-model="formFields.value" />
            <Save
              class="text-green-500 cursor-pointer"
              @click="
                () => {
                  formFields.isEditing = false;
                  saveAlias();
                }
              "
            />
            <SaveOff
              class="text-red-500 cursor-pointer"
              @click="formFields.isEditing = false"
            />
          </div>
        </div>
      </div>
      <div class="text-right">
        <p class="text-lg sm:text-xl font-bold text-green-600">
          {{ account.balance.toLocaleString() }} {{ account.accountCurrency }}
        </p>
      </div>
    </div>

    <div class="flex justify-end items-center mt-2">
      <span class="text-sm text-gray-500">
        Created at
        {{
          account.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </span>
    </div>
  </div>
</template>
