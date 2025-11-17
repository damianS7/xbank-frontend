<script setup lang="ts">
// vue core
import { computed, onMounted, ref, type Ref } from "vue";

// store
import { useNotificationStore } from "@/stores/notification";

// ui
import Button from "@/components/ui/button/Button.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";

// components
import PageLayout from "@/layouts/PageLayout.vue";
import NotificationListItem from "./components/NotificationListItem.vue";
import CustomAlert from "@/components/CustomAlert.vue";

// composables
import { useScrollBottonDetect } from "@/composables/useScrollBottomDetect";
import { usePagination } from "@/composables/usePagination";

// types
import type { PaginatedResponse } from "@/types/response/PaginatedResponse";

// setup
const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);
const mountedComponent = ref(false);

// alert ref
const alert = ref();

// pagination
const notificationScroll: Ref<HTMLDivElement | HTMLElement | null> = ref(null);

// HTMLDivElement
const { currentPage, nextPage, pagination } = usePagination(fetchNotifications);

// methods
async function doOnBottom() {
  if (
    pagination.value &&
    pagination.value.totalPages &&
    currentPage.value >= pagination.value.totalPages - 1
  ) {
    return;
  }
  // next page
  nextPage();
}

async function fetchNotifications() {
  return await notificationStore
    .fetchNotifications(currentPage.value, true)
    .then((response: PaginatedResponse | any) => {
      pagination.value = response;
    });
}

const { isScrollOnBottom } = useScrollBottonDetect(
  notificationScroll,
  doOnBottom
);

onMounted(async () => {
  notificationStore.resetStore();
  await fetchNotifications();
  notificationScroll.value = document.getElementById("page-section-content");
  mountedComponent.value = true;
});
</script>
<template>
  <PageLayout>
    <template #header>
      <div class="flex items-center justify-between">
        <h1>Notifications</h1>
        <Button @click="notificationStore.clearNotifications" size="sm"
          >Clear</Button
        >
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div
        v-if="mountedComponent && notifications && notifications.length > 0"
        class="flex flex-col gap-2"
      >
        <NotificationListItem
          v-for="(notification, index) in notifications"
          :notification="notification"
          :key="index"
        />
      </div>

      <div
        v-else-if="!mountedComponent"
        class="flex items-center gap-2 text-gray-600 justify-center"
      >
        <Spinner class="text-primary" /> Loading notifications ...
      </div>

      <div
        v-else-if="
          mountedComponent && notifications && notifications.length === 0
        "
        class="text-gray-600 text-center"
      >
        No notifications to show ...
      </div>
    </template>
  </PageLayout>
</template>
