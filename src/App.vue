<script setup lang="ts">
import ModalManager from "@/components/modal/ModalManager.vue";
</script>
<template>
  <ModalManager />
  <router-view />
</template>
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
main {
  @apply bg-gray-100;
}

main {
  @apply p-4 rounded shadow;
}
</style>
