<script setup lang="ts">
import { useAppInit } from "@/composables/useAppInit.ts";
import FullScreenLoadingSpinner from "@/components/spinner/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
const appInit = useAppInit();
</script>
<template>
  <FullScreenLoadingSpinner v-if="!appInit.isInitialized()" />
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <SidebarProvider>
      <Sidebar />
      <div class="flex w-full h-full p-4 overflow-hidden">
        <main class="flex flex-1 flex-col">
          <router-view />
        </main>
      </div>
    </SidebarProvider>
  </div>
</template>
