<script setup lang="ts">
import { useTransferStore } from "@/stores/transfer";
import { ref } from "vue";
import { storeToRefs } from "pinia";

// stores
const transferStore = useTransferStore();
const showNotifications = ref(false);
const { countPendingTransfers } = storeToRefs(transferStore);
</script>
<template>
  <span
    v-if="countPendingTransfers > 0"
    class="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[12px] leading-none font-semibold shadow-sm pointer-events-none"
    :class="[showNotifications ? 'bg-gray-300 rounded-full' : '']"
  >
    {{ countPendingTransfers }}
  </span>
</template>
