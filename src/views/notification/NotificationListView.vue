<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { computed, onMounted, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { useNotificationStore } from "@/stores/notification";
import NotificationListItem from "./components/NotificationListItem.vue";

// store
const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

// message to show
const alert = ref();
</script>
<template>
  <div class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2"
    >
      <h1>Notifications</h1>
      <Button @click="notificationStore.clearNotifications" size="sm"
        >CLEAR NOTIFICATIONS</Button
      >
    </section>
    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert ref="alert" />
      <div v-if="notifications" class="flex flex-col gap-2">
        <NotificationListItem
          v-for="(notification, index) in notifications"
          :notification="notification"
          :key="index"
        />
      </div>
      <div v-else>Loading notifications ...</div>
    </section>
  </div>
</template>
