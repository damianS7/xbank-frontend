<script setup lang="ts">
import type { Notification } from "@/types/notification/NotificationBase";
import { NotificationType } from "@/types/notification/NotificationBase";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-vue-next";
import { Bell } from "lucide-vue-next";
import { useNotificationStore } from "@/stores/notification";

// props
defineProps<{
  notification: Notification;
}>();
</script>
<template>
  <div
    v-if="notification"
    class="flex flex-col bg-white rounded shadow w-full p-1"
  >
    <div class="flex justify-between items-center p-2">
      <div class="flex items-center gap-1">
        <Badge variant="default">
          <Bell :size="16" />
          <slot v-if="notification.type === NotificationType.TRANSACTION">
            <router-link
              :to="{
                name: 'banking-transaction',
                params: { id: notification.metadata.transaction.id },
              }"
            >
              {{
                notification.metadata.transaction.transactionType?.replace(
                  /(_TO|_FROM|_CHARGE)$/,
                  ""
                )
              }}
            </router-link>
          </slot>
          <slot v-else>
            {{ notification.type }}
          </slot>
        </Badge>
      </div>
      <div class="flex items-center gap-1">
        <Badge variant="secondary">
          {{
            notification.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </Badge>
        <X
          class="cursor-pointer text-destructive"
          @click="useNotificationStore().deleteNotification(notification.id)"
        ></X>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 ml-2"
    >
      <span class="text-sm sm:text-base italic text-gray-600 break-all">
        <slot v-if="notification.type === NotificationType.TRANSACTION">
          {{ notification.metadata.transaction.description }}
        </slot>
        <slot v-else>
          {{ notification.metadata.message }}
        </slot>
      </span>
    </div>
  </div>
</template>
