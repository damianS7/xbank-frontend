<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>
<style>
@reference "tailwindcss";
* {
  font-family:
    system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header,
nav,
.main-container {
  @apply bg-gray-100;
}

.main-container {
  @apply p-4 rounded shadow;
}
</style>
