import { TokenKey } from "~/constants/api.constants";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    const token = localStorage.getItem(TokenKey);

    if (token) {
      await authStore.initSession();
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/", { replace: true });
  }
});
