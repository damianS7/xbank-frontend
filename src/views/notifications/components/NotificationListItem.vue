<script setup lang="ts">
import type { Notification } from "@/types/Notification";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-vue-next";
import { Bell } from "lucide-vue-next";
import { useNotificationStore } from "@/stores/notification";
import Button from "@/components/ui/button/Button.vue";

// props
defineProps<{
  notification: Notification;
}>();
</script>
<template>
  <div
    v-if="notification"
    class="flex flex-col gap-2 bg-white py-2 px-4 rounded shadow w-full"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <Bell :size="16" />
      </div>
      <div class="flex items-center gap-1">
        <Badge
          v-if="notification.type"
          variant="default"
          @click="useNotificationStore().deleteNotification(notification.id)"
          >{{ notification.type }}
        </Badge>

        <Badge>
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
        <Button
          class="cursor-pointer"
          size="xs"
          variant="destructive"
          @click="useNotificationStore().deleteNotification(notification.id)"
          ><X
        /></Button>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
    >
      <span class="text-sm sm:text-base italic text-gray-600 break-all">
        {{ notification.message }}
      </span>
    </div>
  </div>
</template>
