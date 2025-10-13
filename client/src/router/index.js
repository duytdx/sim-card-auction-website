import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthStore } from "@/stores/AuthStore";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/login",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresUnAuth: true },
  },
  {
    path: "/register",
    component: () => import("../views/RegisterView.vue"),
    meta: { requiresUnAuth: true },
  },
  {
    path: "/forgot-password",
    component: () => import("../views/ForgotPasswordView.vue"),
    meta: { requiresUnAuth: true },
  },
  {
    path: "/confirm-email",
    component: () => import("../views/ConfirmEmailView.vue"),
    meta: { requiresUnAuth: true },
  },
  {
    path: "/reset-password",
    component: () => import("../views/ResetPasswordView.vue"),
    meta: { requiresUnAuth: true },
  },
  {
    path: "/auctions/create",
    component: () => import("../views/CreateAuctionView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    component: () => import("../views/SettingsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/auctions/:id",
    component: () => import("../views/AuctionView.vue"),
  },
  {
    path: "/categories/:id",
    component: () => import("../views/CategoryView.vue"),
  },
  {
    path: "/search",
    component: () => import("../views/SearchView.vue"),
  },
  {
    path: "/profile/:id",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFoundView.vue"),
    name: "NotFound",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Wait until authStore becomes ready if it is not (to avoid misidentifying user state by the checks below)
  await authStore.waitUntilReady();

  // Prevent unauthenticated users from navigating to views that require auth
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } }; // Preserve the intended destination to redirect to it after login
  }

  // Prevent authenticated users from navigating to login, register, and forgot-password views
  if (to.meta.requiresUnAuth && authStore.isLoggedIn) {
    return { path: "/" };
  }

  // Add query param to redirect back to after login
  if (to.path === "/login" && !to.query.redirect) {
    const redirectPath = from.path !== "/login" ? from.fullPath : "/"; // If there is no previous page, from.fullPath defaults to "/"
    return { path: "/login", query: { redirect: redirectPath } };
  }

  // Navigate normally
  return true;
});

export default router;
