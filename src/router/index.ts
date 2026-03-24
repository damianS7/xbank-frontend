import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "@/modules/home/views/HomeView.vue";
import { useAuthStore } from "@/modules/auth/store/auth";
import MainLayout from "@/layouts/MainLayout.vue";
import bankingAccountRouter from "@/modules/banking/account/router";
import bankingTransferRouter from "@/modules/banking/transfers/router";
import bankingTransactionRouter from "@/modules/banking/transaction/router";
import bankingCardRouter from "@/modules/banking/card/router";
import authRouter from "@/modules/auth/router";
import settingsRouter from "@/modules/settings/router";
import userProfileRouter from "@/modules/user/profile/router";
import notificationsRouter from "@/modules/notifications/router";
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
      ...bankingAccountRouter,
      ...bankingTransferRouter,
      ...bankingTransactionRouter,
      ...bankingCardRouter,
      ...userProfileRouter,
      ...settingsRouter,
      ...notificationsRouter,
    ],
  },
  ...authRouter,
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
