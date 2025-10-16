<script setup lang="ts">
import Spinner from "@/components/ui/spinner/Spinner.vue";
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-lg"
  >
    <Spinner class="size-18 text-blue-600" />
  </div>
</template>
