// stores/customerStore.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Notification } from "@/types/Notification";
import { EventSourcePolyfill } from "event-source-polyfill";
import { notificationService } from "@/services/notificationService";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";
const API = import.meta.env.VITE_APP_API_URL;

export const useNotificationStore = defineStore("notification", () => {
  let eventSource: typeof EventSourcePolyfill;
  const initialized = ref(false);
  const notifications = ref<Notification[]>([]);
  const pagination = ref<PaginatedResponse | null>(null);

  const countNotifications = computed(() => {
    if (!pagination.value) {
      return notifications.value.length;
    }
    return pagination.value.totalElements;
  });

  function resetStore() {
    eventSource?.close();
    notifications.value = [];
    pagination.value = null;
    initialized.value = false;
  }

  async function fetchNotifications(page: number = 0): Promise<void> {
    notificationService
      .fetchNotifications(page)
      .then((fetchedNotifications) => {
        fetchedNotifications.content = fetchedNotifications.content.map(
          (notification: any) => ({
            ...notification,
            createdAt: new Date(notification.createdAt),
          })
        );

        notifications.value.push(...fetchedNotifications.content);
        pagination.value = fetchedNotifications;
      });
  }

  async function deleteNotification(id: number): Promise<void> {
    notificationService.deleteNotification(id).then(() => {
      notifications.value = notifications.value.filter(
        (notification) => notification.id !== id
      );
    });
  }

  async function initialize() {
    resetStore();

    // initial notifications (stored in db) fetch from the api
    await fetchNotifications();

    // setup the event source for server-sent events (SSE)
    eventSource = new EventSourcePolyfill(`${API}/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // handle incoming messages (notifications)
    eventSource.onmessage = (event: MessageEvent) => {
      // console.log("🔔 Notification received:", event.data);
      try {
        const notification: Notification = JSON.parse(event.data);
        if (typeof notification.message === "string") {
          // notifications.value.push(notification);
          notifications.value.unshift(notification);
          pagination.value!.totalElements += 1;
        }
      } catch (error) {}
    };

    initialized.value = true;
  }

  async function clearNotifications() {
    notificationService.deleteNotifications().then(() => {
      notifications.value = [];
      pagination.value = null;
    });
  }

  return {
    initialize,
    notifications,
    clearNotifications,
    countNotifications,
    fetchNotifications,
    deleteNotification,
    pagination,
    initialized,
  };
});
