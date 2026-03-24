import type { JwtPayload } from "@/types/api/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authService } from "@/modules/auth/service/authService";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const initialized = ref(false);

  const isAuthenticated = computed(
    () => token.value !== "" && initialized.value === true
  );

  async function initialize() {
    const storedToken = localStorage.getItem("token") ?? "";
    try {
      await authService.validateToken(storedToken);
      token.value = storedToken;
      initialized.value = true;
    } catch (error) {
      // logout();
    }
  }

  async function login(email: string, password: string) {
    try {
      const jwtToken = await authService.login(email, password);
      token.value = jwtToken;
      localStorage.setItem("token", jwtToken);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    token.value = "";
    initialized.value = false;
    localStorage.setItem("token", "");
    router.push({ name: "login" });
  }

  function getPayload() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  return {
    token,
    initialized,
    isAuthenticated,
    login,
    logout,
    initialize,
    getPayload,
  };
});
