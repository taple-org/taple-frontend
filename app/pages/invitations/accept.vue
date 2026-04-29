<script lang="ts" setup>
import { useI18n } from "vue-i18n";

definePageMeta({
  layout: "empty",
});

const { t, locale } = useI18n();

useSeoMeta({
  title: t("invitations.seoTitle"),
  description: t("invitations.seoDescription"),
  robots: "noindex, nofollow",
})

const route = useRoute();
const router = useRouter();
const { $config } = useNuxtApp();
const notification = useNotification();
const authStore = useAuthStore();

const invitationToken = computed(() => route.query.token as string | undefined);
const statusMessage = ref(t("invitations.processing"));

async function acceptInvitation() {
  if (!invitationToken.value) {
    notification.error(t("common.error"), t("invitations.invalidLink"));
    await router.push("/");
    return;
  }

  await authStore.initSession();

  statusMessage.value = t("invitations.joining");

  try {
    const token =
      authStore.isAuthenticated && import.meta.client
        ? localStorage.getItem("access_token")
        : null;

    const apiBase = $config.public.apiBase;
    const backendKey = $config.public.backendKey;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Backend-Key": backendKey,
    };

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
        errorData?.error?.meta?.error?.message?.[locale.value] ||
        errorData?.error?.meta?.error?.message?.ru ||
        errorData?.error?.meta?.error?.message?.en ||
        t("invitations.acceptError");

      // If login is required, show info notification instead of error
      if (action === "login_required") {
        notification.info(t("invitations.authRequiredTitle"), message);
        await router.push("/");
        return;
      }

      throw new Error(message);
    }

    const data = await response.json();
    const tenantId = data.result?.tenant_id;

    if (tenantId) {
      notification.success(
        t("common.success"),
        t("invitations.joinSuccess"),
      );
      await router.push(`/workspaces/${tenantId}/dashboard`);
    } else {
      notification.error(
        t("common.error"),
        t("invitations.workspaceIdError"),
      );
      await router.push("/");
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : t("invitations.acceptError");
    notification.error(t("common.error"), message);
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
