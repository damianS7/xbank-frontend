<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/modules/user/user/store/user";
const userStore = useUserStore();
const user = userStore.user;

const profileImgURL = ref("");

onMounted(() => {
  if (user?.profile?.photoUrl) {
    reloadProfileImg();
  }
});

watch(
  () => user?.profile?.photoUrl,
  () => {
    reloadProfileImg();
  },
  { immediate: true }
);

// updates the photoUrl
function reloadProfileImg() {
  const profilePhotoURL = localStorage.getItem("profilePhotoURL");
  if (profilePhotoURL) {
    profileImgURL.value = profilePhotoURL;
  }
}
</script>
<template>
  <img v-if="profileImgURL" :src="profileImgURL" />
  <div v-else class="bg-gray-300"></div>
</template>
