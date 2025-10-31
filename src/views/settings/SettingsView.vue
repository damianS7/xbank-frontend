<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { computed, ref } from "vue";
import { useModalStore } from "@/stores/modal";
import Button from "@/components/ui/button/Button.vue";

// store
const modalStore = useModalStore();

// message to show
const alert = ref<InstanceType<typeof CustomAlert>>();
</script>
<template>
  <div class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2"
    >
      <h1>Settings</h1>
      <Button size="sm">Save settings</Button>
    </section>

    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert class="mb-4" ref="alert" />

      <form class="space-y-6">
        <!-- Enable 2FA -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium"
            >Enable Two-Factor Authentication (2FA)</label
          >
          <input type="checkbox" class="w-5 h-5 accent-blue-500" />
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium">Email Notifications</label>
          <input type="checkbox" class="w-5 h-5 accent-blue-500" />
        </div>

        <!-- Language Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <!-- Theme Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Theme</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </form>
    </section>
  </div>
</template>
