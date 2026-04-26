<template>
  <aside class="sidebar">
    <div class="nav-group">
      <span class="nav-group-label">{{ t("settings.account") }}</span>
      <NuxtLink
        v-for="item in accountLinks"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <Icon :name="`my-icon:${item.icon}`" class="nav-icon" />
        {{ item.label }}
      </NuxtLink>
    </div>

    <div class="divider" />

    <div class="nav-group">
      <span class="nav-group-label">{{ t("settings.settings") }}</span>
      <NuxtLink
        v-for="item in settingsLinks"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <Icon :name="`my-icon:${item.icon}`" class="nav-icon" />
        {{ item.label }}
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

const accountLinks = computed(() => [
  { to: "/settings/profile", label: t("nav.profile"), icon: "profile" },
  { to: "/settings/security", label: t("nav.security"), icon: "settings" },
]);

const settingsLinks = computed(() => [
  {
    to: "/settings/notifications",
    label: t("settings.notifications.title"),
    icon: "inbox",
  },
  {
    to: "/settings/subscription",
    label: t("subscription.currentPlan"),
    icon: "star-filled",
  },
]);

function isActive(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.sidebar {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 8px;
  position: sticky;
  top: 24px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-group-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-neutral-dl);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 10px 12px 6px;
  display: block;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: calc(var(--radius-md) - 2px);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-neutral-dm);
  transition:
    background var(--transition-base),
    color var(--transition-base);
  cursor: pointer;
}

.nav-item:hover {
  background: var(--color-neutral-ll);
}

.nav-item.active {
  background: var(--color-highlight-l);
  color: var(--color-highlight-d);
  font-weight: 500;
}

.nav-item.active .nav-icon {
  color: var(--color-highlight-d);
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-neutral-dl);
  transition: color var(--transition-base);
}

.divider {
  border: none;
  border-top: 1px solid var(--color-neutral-lm);
  margin: 6px 0;
}
</style>
