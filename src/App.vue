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
  @apply bg-neutral-50;
}

main {
  @apply rounded shadow;
}

.pg-section-content {
  @apply p-4;
}

.pg-section-header {
  @apply p-2;
}
</style>
