<script setup lang="ts">
import { defineProps } from "vue";
import NotificationBubble from "./NotificationBubble.vue";
defineProps<{
  to: string;
  icon?: unknown;
  label: string;
}>();
</script>
<template>
  <RouterLink
    :to="{ name: to }"
    :class="[
      'flex gap-2 items-center rounded',
      // $route.name === to ? 'bg-gray-200' : '',
    ]"
  >
    <component :is="icon" />
    <NotificationBubble v-if="to === 'notifications'" />
    <span>{{ label }}</span>
  </RouterLink>
</template>
<style scoped>
@reference "tailwindcss";
.router-link-active,
.router-link-exact-active {
  @apply bg-gray-200;
}
</style>
