<script setup lang="ts">
import { useNotificationStore } from "@/stores/notification";
import { ref } from "vue";
import { storeToRefs } from "pinia";

// stores
const notificationStore = useNotificationStore();
const showNotifications = ref(false);
const { countNotifications: unreadNotifications } =
  storeToRefs(notificationStore);
</script>
<template>
  <span
    class="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[12px] leading-none font-semibold shadow-sm pointer-events-none"
    :class="[showNotifications ? 'bg-gray-300 rounded-full' : '']"
  >
    {{ unreadNotifications }}
  </span>
</template>
