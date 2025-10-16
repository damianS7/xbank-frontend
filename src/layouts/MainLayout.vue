<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/spinner/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { useAppInit } from "@/composables/useAppInit";
const appInit = useAppInit();
</script>
<template>
  <FullScreenLoadingSpinner v-if="!appInit.isInitialized()" />
  <div v-else class="flex h-screen overflow-hidden">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Header />

      <div class="flex-1 overflow-auto p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
