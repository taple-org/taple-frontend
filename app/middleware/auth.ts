import { TokenKey } from "~/constants/api.constants";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const tokenCookie = useCookie<string | null>(TokenKey);

  if (!authStore.isAuthenticated) {
    const token = import.meta.client
      ? (localStorage.getItem(TokenKey) || tokenCookie.value)
      : tokenCookie.value;

    if (token) {
      await authStore.initSession();
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/", { replace: true });
  }
});
