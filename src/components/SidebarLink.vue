<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  to: string;
  icon?: unknown;
  label: string;
}>();
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      'flex items-center gap-4 p-4 rounded',
      $route.path === to ? 'bg-gray-200' : 'hover:bg-gray-200',
    ]"
  >
    <component :is="icon" />
    <span>{{ label }}</span>
  </RouterLink>
</template>
