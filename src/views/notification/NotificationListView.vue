<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { computed, onMounted, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { useNotificationStore } from "@/stores/notification";
import NotificationListItem from "./components/NotificationListItem.vue";
import PageLayout from "@/layouts/PageLayout.vue";

// store
const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

// message to show
const alert = ref();
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Notifications</h1>
      <Button @click="notificationStore.clearNotifications" size="sm"
        >Clear</Button
      >
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div
        v-if="notifications && notifications.length > 0"
        class="flex flex-col gap-2"
      >
        <NotificationListItem
          v-for="(notification, index) in notifications"
          :notification="notification"
          :key="index"
        />
      </div>

      <div v-else-if="!notifications" class="text-gray-600 text-center">
        Loading notifications ...
      </div>

      <div v-else class="text-gray-600 text-center">
        No notifications to show ...
      </div>
    </template>
  </PageLayout>
</template>
