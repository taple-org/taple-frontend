<script setup lang="ts">
const route = useRoute();

const tabs = [
  { label: "Дэшбоард", to: "/dashboard" },
  { label: "Лиды", to: "/dashboard/leads" },
  { label: "Воронка", to: "/dashboard/pipeline" },
  { label: "Мониторинг", to: "/dashboard/monitoring" },
  { label: "Задачи", to: "/dashboard/tasks" },
  { label: "Настройки", to: "/dashboard/settings" },
];

const userEmail = "test@gmail.com";

const isActive = (to: string) => {
  if (to === "/dashboard") {
    return route.path === "/dashboard";
  }

  return route.path.startsWith(to);
};
</script>

<template>
  <header class="dashboard-header">
    <h1 class="dashboard-header__logo">TAPLE</h1>

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

    <button
      class="dashboard-header__profile"
      type="button"
      aria-label="User profile"
    >
      <span class="dashboard-header__email">{{ userEmail }}</span>
      <Icon
        name="my-icon-profile"
        mode="svg"
        size="18"
        class="dashboard-header__profile-icon"
      />
    </button>
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

.dashboard-header__logo {
  margin: 0;
  color: #2f3036;
  font-size: 24px;
  line-height: normal;
  letter-spacing: 0.24px;
  font-weight: 700;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 16px;
  border: 0;
  border-radius: 100px;
  background: var(--color-highlight-l);
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
