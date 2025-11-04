import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "@/views/home/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BankingAccountListView from "@/views/banking/account/BankingAccountListView.vue";
import BankingAccountItemView from "@/views/banking/account/BankingAccountItemView.vue";
import BankingCardListView from "@/views/banking/card/BankingCardListView.vue";
import BankingCardItemView from "@/views/banking/card/BankingCardItemView.vue";
import SettingsView from "@/views/settings/SettingsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import PendingTransactionsView from "@/views/banking/transaction/PendingTransactionsView.vue";
import VerificationView from "@/views/auth/verification/VerificationView.vue";
import ResendVerificationView from "@/views/auth/verification/ResendVerificationView.vue";
import ResetPasswordView from "@/views/auth/password/reset/ResetPasswordView.vue";
import ResetPasswordSetView from "@/views/auth/password/reset/ResetPasswordSetView.vue";
import { useAuthStore } from "@/stores/auth";
import NotificationView from "@/views/notification/NotificationListView.vue";

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
        path: "/banking/accounts",
        name: "banking-accounts",
        component: BankingAccountListView,
      },
      {
        path: "/banking/account/:id",
        name: "banking-account",
        component: BankingAccountItemView,
      },
      {
        path: "/banking/transactions",
        name: "banking-transactions",
        component: PendingTransactionsView,
      },
      {
        path: "/banking/cards",
        name: "banking-cards",
        component: BankingCardListView,
      },
      {
        path: "/banking/card/:id",
        name: "banking-card",
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
      {
        path: "notifications",
        name: "notifications",
        component: NotificationView,
      },
    ],
  },
  {
    path: "/customers/accounts",
    component: AuthLayout,
    redirect: "/customers/accounts/login",
    meta: { requiresAuth: false, redirectIfAuth: true },
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "logout",
        name: "logout",
        component: LoginView,
        beforeEnter: () => {
          useAuthStore().logout();
        },
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
      {
        path: "verification/:token?",
        name: "verify-account",
        component: VerificationView,
      },
      {
        path: "verification/resend",
        name: "resend-verification",
        component: ResendVerificationView,
      },
      {
        path: "password/reset",
        name: "reset-password",
        component: ResetPasswordView,
      },
      {
        path: "password/reset/:token",
        name: "reset-password-set",
        component: ResetPasswordSetView,
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

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await authStore.initialize();
  const isAuthenticated = authStore.isAuthenticated;

  // if you access logout route and you are authenticated
  if (to.name === "logout" && isAuthenticated) {
    return next();
  }

  // if to path requires authentication but you are not authenticated ...
  if (to.meta.requiresAuth && !isAuthenticated) {
    // redirect to login
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  // if to path forces you to redirect when authenticated and you are ...
  if (to.meta.redirectIfAuth && isAuthenticated) {
    // redirects to home
    return next({
      name: "home",
    });
  }

  // from now on you are authenticated
  // if the route requires a role ...
  if (to.meta.requiresAuth && to.meta.role) {
    // get the user role
    const role = authStore.getPayload()?.role || "USER";

    // compare them
    if (role !== to.meta.role) {
      return next({
        path: "/404",
      });
    }
  }

  next();
});
export default router;
