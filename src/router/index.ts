import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BankingAccountsView from "@/views/account/BankingAccountListView.vue";
import BankingAccountView from "@/views/account/BankingAccountItemView.vue";
import BankingCardListView from "@/views/card//BankingCardListView.vue";
import BankingCardItemView from "@/views/card//BankingCardItemView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import PendingTransactionsView from "@/views/PendingTransactionsView.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: HomeView,
      },
      {
        path: "accounts",
        name: "accounts",
        component: BankingAccountsView,
      },
      {
        path: "account/:id",
        name: "account",
        component: BankingAccountView,
      },
      {
        path: "transactions",
        name: "transactions",
        component: PendingTransactionsView,
      },
      {
        path: "cards",
        name: "cards",
        component: BankingCardListView,
      },
      {
        path: "card/:id",
        name: "card",
        component: BankingCardItemView,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfileView,
      },
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPasswordView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
    // next({ path: "/auth/login" }); // opcional: guardar destino
  } else {
    next();
  }
});

export default router;
