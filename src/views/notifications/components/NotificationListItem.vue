<script setup lang="ts">
import type { Notification } from "@/types/notification/Notification";
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
          <slot v-if="notification.type === 'TRANSACTION'">
            <router-link
              :to="{
                name: 'banking-transaction',
                params: { id: notification.metadata.transactionId },
              }"
            >
              {{
                notification.metadata.transactionType?.replace(
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
        <slot v-if="notification.type === 'TRANSACTION'">
          <!-- TRANSFER FROM -->
          <slot
            v-if="notification.metadata.transactionType === 'TRANSFER_FROM'"
          >
            You have received {{ notification.metadata.amount }} from
            {{ notification.metadata.transferFrom }}
          </slot>

          <!-- TRANSFER TO -->
          <slot v-if="notification.metadata.transactionType === 'TRANSFER_TO'">
            You have sent {{ notification.metadata.amount }}
            {{ notification.metadata.currency }} to
            {{ notification.metadata.transferTo }}
          </slot>

          <!-- CARD CHARGE -->
          <slot v-if="notification.metadata.transactionType === 'CARD_CHARGE'">
            You have spent {{ notification.metadata.amount }}
          </slot>
        </slot>
        <slot v-else>
          {{ notification.message }}
        </slot>
      </span>
    </div>
  </div>
</template>
