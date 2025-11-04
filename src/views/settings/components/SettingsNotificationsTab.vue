<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
import Switch from "@/components/ui/switch/Switch.vue";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
// store
const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="notifications" class="">
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription> CardDescription </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2">
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
        <form class="space-y-6">
          <!-- Enable 2FA -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium"
              >Enable Two-Factor Authentication (2FA)</label
            >
            <Switch
              v-model="settingStore.settings.TWO_FACTOR_AUTHENTICATION"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <label class="text-lg font-medium">Email Notifications</label>
            <Switch
              v-model="settingStore.settings.EMAIL_NOTIFICATIONS"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Language Selector -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
            <select
              class="border rounded p-2 w-full sm:w-auto"
              v-model="settingStore.settings.LANGUAGE"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </form>
      </CardContent>
      <CardFooter> </CardFooter>
    </Card>
  </TabsContent>
</template>
