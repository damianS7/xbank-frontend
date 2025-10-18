<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/spinner/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import { useAppInit } from "@/composables/useAppInit";
import { SidebarProvider } from "@/components/ui/sidebar";
const appInit = useAppInit();
</script>
<template>
  <FullScreenLoadingSpinner v-if="!appInit.isInitialized()" />
  <div v-else class="flex h-screen overflow-hidden">
    <SidebarProvider>
      <Sidebar />
      <main class="flex-1 flex flex-col overflow-auto p-6">
        <!-- <div class="flex-1 overflow-auto p-6"> -->
        <router-view />
        <!-- </div> -->
      </main>
    </SidebarProvider>
  </div>
</template>
