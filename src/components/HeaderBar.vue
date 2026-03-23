<script setup lang="ts">
import { useUserStore } from "@/modules/user/user/store/user";
import { Bell } from "lucide-vue-next";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
const userStore = useUserStore();
const user = userStore.user;
</script>
<template>
  <header class="flex justify-end items-center gap-2 w-full p-2 shadow">
    <span v-if="user">
      Welcome
      <b class="uppercase">{{ user.profile?.firstName }}</b>
    </span>

    <span>
      <ProfilePhoto class="rounded-full w-6 h-6 bg-gray-300" />
    </span>
    <Bell />
  </header>
</template>
