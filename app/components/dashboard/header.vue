<script setup lang="ts">
import { useAuthModalController } from "~/composables/modals/useAuthModalController";
import type { TenantRead } from "~/api/generated/api";

const route = useRoute();
const { $apiClient } = useNuxtApp();
const { isAuthenticated } = storeToRefs(useAuthStore());

const workspaceId = computed(() => route.params.workspaceId as string);

// Fetch workspace name
const workspace = ref<TenantRead | null>(null);

async function fetchWorkspace() {
  if (!workspaceId.value || !isAuthenticated.value) return;
  try {
    const response = await $apiClient.api.getTenantApiV1TenantsTenantIdGet(
      workspaceId.value,
    );
    workspace.value = response.data.result;
  } catch (error: any) {
    if (error?.status !== 401) {
      console.error("Failed to fetch workspace:", error);
    }
  }
}

watch(
  [workspaceId, isAuthenticated],
  () => {
    fetchWorkspace();
  },
  { immediate: true },
);

const tabs = computed(() => [
  { label: "Дэшбоард", to: `/workspaces/${workspaceId.value}/dashboard` },
  { label: "Лиды", to: `/workspaces/${workspaceId.value}/dashboard/leads` },
  {
    label: "Воронка",
    to: `/workspaces/${workspaceId.value}/dashboard/pipeline`,
  },
  {
    label: "Мониторинг",
    to: `/workspaces/${workspaceId.value}/dashboard/monitoring`,
  },
  { label: "Задачи", to: `/workspaces/${workspaceId.value}/dashboard/tasks` },
  {
    label: "Настройки",
    to: `/workspaces/${workspaceId.value}/dashboard/settings`,
  },
]);

const controller = useAuthModalController();
const isActive = (to: string) => {
  if (to === `/workspaces/${workspaceId.value}/dashboard`) {
    return route.path === `/workspaces/${workspaceId.value}/dashboard`;
  }
  return route.path.startsWith(to);
};
</script>

<template>
  <header class="dashboard-header">
    <div class="dashboard-header__brand">
      <h1 class="dashboard-header__logo" @click="$router.push('/')">TAPLE</h1>
      <span v-if="workspace?.name" class="dashboard-header__workspace">{{
        workspace.name?? "helloaasdfasd"
      }}</span>
    </div>

    <nav class="dashboard-header__tabs" aria-label="Dashboard sections">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        :to="tab.to"
        class="dashboard-header__tab"
        :class="{ 'dashboard-header__tab--active': isActive(tab.to) }"
      >
        <span class="dashboard-header__tab-title">{{ tab.label }}</span>
        <span class="dashboard-header__tab-indicator" />
      </NuxtLink>
    </nav>

    <div class="dashboard-header__profile">
      <client-only>
        <ui-button v-if="!isAuthenticated" @click="controller.open('login')">
          Войти
        </ui-button>
        <app-header-profile v-else />
        <template #fallback>
          <ui-button disabled>Войти</ui-button>
        </template>
      </client-only>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  gap: 44px;
  /* width: 100%; */
  padding: 10px 72px;
  background: #ffffff;
  border-bottom: 1px solid #f4f5f6;
  box-shadow: 0 2px 10px 0 #0000001a;
}

.dashboard-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.dashboard-header__logo {
  margin: 0;
  color: #2f3036;
  font-size: 24px;
  line-height: normal;
  letter-spacing: 0.24px;
  font-weight: 700;
  cursor: pointer;
}

.dashboard-header__workspace {
  color: var(--color-neutral-dl);
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

.dashboard-header__tabs {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.dashboard-header__tabs::-webkit-scrollbar {
  display: none;
}

.dashboard-header__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  height: 44px;
  padding: 0 16px;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 12px;
}

.dashboard-header__tab-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  color: #71727a;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.dashboard-header__tab-indicator {
  width: 24px;
  height: 4px;
  border-radius: 2px;
  background: transparent;
}

.dashboard-header__tab--active .dashboard-header__tab-title {
  color: var(--color-neutral-dd);
  font-weight: 700;
}

.dashboard-header__tab--active .dashboard-header__tab-indicator {
  background: var(--color-highlight-d);
}

.dashboard-header__profile {
  margin-left: auto;
  cursor: pointer;
}

.dashboard-header__email {
  color: var(--color-highlight-d);
  font-size: 14px;
  line-height: normal;
  font-weight: 700;
}

.dashboard-header__profile-icon {
  color: var(--color-highlight-d);
}

@media (max-width: 980px) {
  .dashboard-header {
    gap: 20px;
    padding: 10px 20px;
  }

  .dashboard-header__logo {
    font-size: 26px;
  }
}

@media (max-width: 680px) {
  .dashboard-header {
    flex-wrap: wrap;
    gap: 10px 14px;
  }

  .dashboard-header__tabs {
    order: 3;
    width: 100%;
  }
}
</style>
