import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Notification } from "@/types/notification/Notification";
import { EventSourcePolyfill } from "event-source-polyfill";
import { notificationService } from "@/services/notificationService";
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);
  const unreadNotificationsCount = ref(0);
  const initialized = ref(false);
  let eventSource: typeof EventSourcePolyfill;

  const countNotifications = computed(() => {
    return unreadNotificationsCount.value;
  });

  function resetStore() {
    eventSource?.close();
    notifications.value = [];
    initialized.value = false;
  }

  async function fetchNotifications(
    page: number = 0,
    returnPaginated: boolean = false
  ): Promise<Notification[] | PaginatedResponse> {
    const response: PaginatedResponse =
      await notificationService.fetchNotifications(page);

    response.content = response.content.map((notification: any) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }));

    notifications.value.push(...response.content);
    unreadNotificationsCount.value = response.totalElements;
    return returnPaginated ? response : notifications.value;
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

          updateUnreadCount(+1);
        }
      } catch (error) {}
    };

    initialized.value = true;
  }

  async function clearNotifications() {
    // notificationService.deleteNotifications().then(() => {
    //   notifications.value = [];
    // });
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
    clearNotifications,
    countNotifications,
    fetchNotifications,
    deleteNotification,
    initialized,
    resetStore,
  };
});
