<template>
  <div v-for="group in groups" :key="group.title" class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ group.title }}</h2>
      <p class="card-desc">{{ group.description }}</p>
    </div>

    <div class="toggle-list">
      <div v-for="item in group.items" :key="item.key" class="toggle-row">
        <div class="toggle-info">
          <div class="toggle-name">{{ item.label }}</div>
          <div class="toggle-desc">{{ item.description }}</div>
        </div>
        <ui-switch v-model="item.enabled" />
      </div>
    </div>

    <div v-if="group === groups[groups.length - 1]" class="form-footer">
      <div v-if="saved" class="success-banner">
        {{ t("notifications.saved") }}
      </div>
      <ui-button variant="outline" @click="resetToDefault">{{
        t("notifications.reset")
      }}</ui-button>
      <ui-button :disabled="isSaving" @click="saveSettings">
        {{ isSaving ? t("notifications.saving") : t("common.save") }}
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

interface NotificationItem {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationGroup {
  title: string;
  description: string;
  items: NotificationItem[];
}

const groups = computed<NotificationGroup[]>(() => [
  {
    title: t("notifications.emailTitle"),
    description: t("notifications.emailDesc"),
    items: [
      {
        key: "email_security",
        label: t("notifications.security"),
        description: t("notifications.securityDesc"),
        enabled: true,
      },
      {
        key: "email_activity",
        label: t("notifications.accountActivity"),
        description: t("notifications.accountActivityDesc"),
        enabled: true,
      },
      {
        key: "email_product",
        label: t("notifications.productNews"),
        description: t("notifications.productNewsDesc"),
        enabled: false,
      },
      {
        key: "email_billing",
        label: t("notifications.billing"),
        description: t("notifications.billingDesc"),
        enabled: true,
      },
    ],
  },
  {
    title: t("notifications.pushTitle"),
    description: t("notifications.pushDesc"),
    items: [
      {
        key: "push_leads",
        label: t("notifications.newLeads"),
        description: t("notifications.newLeadsDesc"),
        enabled: true,
      },
      {
        key: "push_tasks",
        label: t("notifications.tasks"),
        description: t("notifications.tasksDesc"),
        enabled: true,
      },
      {
        key: "push_team",
        label: t("notifications.teamActions"),
        description: t("notifications.teamActionsDesc"),
        enabled: false,
      },
    ],
  },
  {
    title: t("notifications.smsTitle"),
    description: t("notifications.smsDesc"),
    items: [
      {
        key: "sms_security",
        label: t("notifications.criticalSecurity"),
        description: t("notifications.criticalSecurityDesc"),
        enabled: true,
      },
      {
        key: "sms_billing",
        label: t("notifications.paymentNotices"),
        description: t("notifications.paymentNoticesDesc"),
        enabled: false,
      },
    ],
  },
]);

const isSaving = ref(false);
const saved = ref(false);

const defaults = computed(() =>
  groups.value.map((g) => ({
    key: g.title,
    items: g.items.map((i) => ({ key: i.key, enabled: i.enabled })),
  })),
);

async function saveSettings() {
  isSaving.value = true;
  saved.value = false;
  try {
    // TODO: await $fetch('/api/user/notifications', { method: 'PUT', body: { ... } })
    await new Promise((r) => setTimeout(r, 600));
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 3000);
  } finally {
    isSaving.value = false;
  }
}

function resetToDefault() {
  defaults.value.forEach((d) => {
    const group = groups.value.find((g) => g.title === d.key);
    d.items.forEach((di) => {
      const item = group?.items.find((i) => i.key === di.key);
      if (item) item.enabled = di.enabled;
    });
  });
}
</script>

<style scoped>
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.toggle-list {
  display: flex;
  flex-direction: column;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-neutral-ll);
}

.toggle-row:last-child {
  border-bottom: none;
}

.toggle-info {
  flex: 1;
  min-width: 0;
}

.toggle-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 2px;
}

.toggle-desc {
  font-size: 12px;
  color: var(--color-neutral-dl);
  line-height: 1.5;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.success-banner {
  margin-right: auto;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-success);
  background: var(--color-success-l);
  padding: 8px 14px;
  border-radius: var(--radius-md);
}
</style>
