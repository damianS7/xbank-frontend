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
    :to="{ name: to }"
    :class="[
      'items-center rounded',
      $route.name === to ? 'bg-gray-200' : 'hover:bg-gray-200',
    ]"
  >
    <component :is="icon" />
    <span>{{ label }}</span>
  </RouterLink>
</template>
