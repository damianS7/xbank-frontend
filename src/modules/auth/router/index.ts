import AuthLayout from "@/layouts/AuthLayout.vue";
import LoginView from "@/modules/auth/views/LoginView.vue";
import RegisterView from "@/modules/auth/views/RegisterView.vue";
import VerificationView from "@/modules/auth/views/verification/VerificationView.vue";
import ResendVerificationView from "@/modules/auth/views/verification/ResendVerificationView.vue";
import ResetPasswordView from "@/modules/auth/views/password/reset/ResetPasswordView.vue";
import ResetPasswordSetView from "@/modules/auth/views/password/reset/ResetPasswordSetView.vue";
import { useAuthStore } from "@/modules/auth/store/auth";

export default [
  {
    path: "/users/accounts",
    component: AuthLayout,
    redirect: "/users/accounts/login",
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
];
