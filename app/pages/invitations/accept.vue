<script lang="ts" setup>
definePageMeta({
  layout: "empty",
});

useSeoMeta({
  title: "Приглашение в рабочее пространство — Taple",
  description: "Подтверждение приглашения в рабочее пространство Taple.",
  robots: "noindex, nofollow",
})

const route = useRoute();
const router = useRouter();
const { $config } = useNuxtApp();
const notification = useNotification();
const authStore = useAuthStore();

const invitationToken = computed(() => route.query.token as string | undefined);
const statusMessage = ref("Обработка приглашения...");

async function acceptInvitation() {
  if (!invitationToken.value) {
    notification.error("Ошибка", "Недействительная ссылка приглашения");
    await router.push("/");
    return;
  }

  // Initialize auth store to check if user is logged in
  await authStore.initSession();

  statusMessage.value = "Присоединение к рабочему пространству...";

  try {
    // Get auth token if user is authenticated
    const token =
      authStore.isAuthenticated && import.meta.client
        ? localStorage.getItem("access_token")
        : null;

    const apiBase = $config.public.apiBase;
    const backendKey = $config.public.backendKey;

    // Build headers - Authorization is optional
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Backend-Key": backendKey,
    };

    // Add Authorization header only if user is authenticated
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${apiBase}/api/v1/tenants/invitations/accept`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          token: invitationToken.value,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const action = errorData?.error?.meta?.error?.action;
      const message =
        errorData?.error?.meta?.error?.message?.ru ||
        errorData?.error?.meta?.error?.message?.en ||
        "Не удалось принять приглашение";

      // If login is required, show info notification instead of error
      if (action === "login_required") {
        notification.info("Требуется авторизация", message);
        await router.push("/");
        return;
      }

      throw new Error(message);
    }

    const data = await response.json();
    const tenantId = data.result?.tenant_id;

    if (tenantId) {
      notification.success(
        "Успех",
        "Вы присоединились к рабочему пространству",
      );
      await router.push(`/workspaces/${tenantId}/dashboard`);
    } else {
      notification.error(
        "Ошибка",
        "Не удалось получить ID рабочего пространства",
      );
      await router.push("/");
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Не удалось принять приглашение";
    notification.error("Ошибка", message);
    await router.push("/");
  }
}

onMounted(() => {
  acceptInvitation();
});
</script>

<template>
  <div class="invitation-page">
    <div class="loader-container">
      <span class="loader"></span>
      <p class="status-text">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.invitation-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loader {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.status-text {
  font-family: var(--font-base), sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
