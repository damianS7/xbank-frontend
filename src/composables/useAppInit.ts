import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
// import { useUserStore } from "@/stores/user";
// import { useSettingStore } from "@/stores/setting";
// import { useNotificationStore } from "@/stores/notification";
import { authService } from "@/services/authService";

export function useAppInit() {
  const authStore = useAuthStore();
  // const userStore = useUserStore();
  // const settingStore = useSettingStore();
  // const notificationStore = useNotificationStore();
  const tokenValidationInterval = 60 * 1000; // 60s
  let interval: NodeJS.Timeout;
  let initialized = ref(false);

  // functions
  async function checkIfTokenIsValid() {
    const token = authStore.token;
    // const token = "bad-token";
    try {
      await authService.validateToken(token);
    } catch (error) {
      initialized.value = false;
      await authStore.logout();
      await wait(100);
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function wait(ms: number) {
    await sleep(ms);
  }

  function isInitialized() {
    return initialized.value;
  }

  onMounted(async () => {
    await sleep(1000);
    interval = setInterval(async () => {
      await checkIfTokenIsValid();
    }, tokenValidationInterval);
    // await userStore.initialize();
    // await settingStore.initialize();
    // await notificationStore.initialize();
    initialized.value = true;
  });
  onUnmounted(() => {
    clearInterval(interval);
  });

  return { isInitialized };
}
