import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { type Notification } from "@/modules/notifications/types/Notification";
import { EventSourcePolyfill } from "event-source-polyfill";
import { notificationService } from "@/modules/notifications/service/notificationService";
import { mapNotification } from "@/modules/notifications/types/Notification";
import type { PaginatedResponse } from "@/types/api/response/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);
  const pagination = ref<PaginatedResponse>();
  const unreadNotificationsCount = ref(0);
  const initialized = ref(false);
  let eventSource: typeof EventSourcePolyfill;
  // let eventSource: EventSource | null = null;

  const countNotifications = computed(() => {
    return unreadNotificationsCount.value;
  });

  async function resetStore() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    notifications.value = [];
    initialized.value = false;
  }

  async function initialize() {
    // if (eventSource && eventSource.readyState === EventSource.OPEN) {
    //   return;
    // }
    await resetStore();

    // initial notifications (stored in db) fetch from the api
    await fetchNotifications();

    // setup the event source for server-sent events (SSE)
    // const options: EventSourceInitDict = {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   heartbeatTimeout: 35000,
    //   reconnectInterval: 5000,
    // };

    // eventSource = new EventSourcePolyfill(
    //   `${API}/notifications/stream`,
    //   options as EventSourceInitDict
    // );

    eventSource = new EventSourcePolyfill(`${API}/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      heartbeatTimeout: 35000,
      reconnectInterval: 5000,
    });

    eventSource.onclose = () => {
      console.log("⚠️ SSE connection closed");
    };

    eventSource.onopen = () => {
      console.log("✅ SSE connection opened");
    };

    eventSource.addEventListener("heartbeat", (event: MessageEvent) => {
      console.log("💓 Heartbeat:", event.data);
    });

    eventSource.addEventListener("notification", (event: MessageEvent) => {
      console.log("📨 Notification:", event.data);
      try {
        const notification: Notification = mapNotification(
          JSON.parse(event.data)
        );

        console.log("🔔 Notification received:", notification);
        notifications.value.unshift(notification);

        updateUnreadCount(+1);
      } catch (error) {
        console.error("❌ JSON parse notification error", error, event.data);
      }
    });

    initialized.value = true;
  }

  async function fetchNotifications(
    page: number = 0
  ): Promise<PaginatedResponse> {
    const response: PaginatedResponse =
      await notificationService.fetchNotifications(page);

    response.content = response.content.map((notification: any) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }));

    pagination.value = response;
    notifications.value.push(...response.content);
    unreadNotificationsCount.value = response.totalElements;
    return response;
  }

  async function deleteNotification(id: number): Promise<void> {
    notificationService.deleteNotification(id).then(() => {
      notifications.value = notifications.value.filter(
        (notification) => notification.id !== id
      );

      updateUnreadCount(-1);
    });
  }

  function updateUnreadCount(count: number) {
    // check < 0
    if (unreadNotificationsCount.value + count < 0) {
      unreadNotificationsCount.value = 0;
      return;
    }
    unreadNotificationsCount.value += count;
  }
  async function clearNotifications() {
    const notificationIds: number[] = [];

    notifications.value.map(async (notification) => {
      notificationIds.push(notification.id);
    });

    notificationService.deleteNotificationsById(notificationIds).then(() => {
      notifications.value = [];
      updateUnreadCount(-notificationIds.length);
      // resetStore();
      // fetchNotifications();
    });
  }

  return {
    initialize,
    notifications,
    pagination,
    clearNotifications,
    countNotifications,
    fetchNotifications,
    deleteNotification,
    initialized,
    resetStore,
  };
});
