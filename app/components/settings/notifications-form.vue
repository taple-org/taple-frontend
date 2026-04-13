<template>
  <div v-for="group in groups" :key="group.title" class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ group.title }}</h2>
      <p class="card-desc">{{ group.description }}</p>
    </div>

    <div class="toggle-list">
      <div
        v-for="item in group.items"
        :key="item.key"
        class="toggle-row"
      >
        <div class="toggle-info">
          <div class="toggle-name">{{ item.label }}</div>
          <div class="toggle-desc">{{ item.description }}</div>
        </div>
        <ui-switch v-model="item.enabled" />
      </div>
    </div>

    <!-- Footer only on the last card -->
    <div v-if="group === groups[groups.length - 1]" class="form-footer">
      <div v-if="saved" class="success-banner">Настройки сохранены</div>
      <ui-button variant="outline" @click="resetToDefault">Сбросить</ui-button>
      <ui-button :disabled="isSaving" @click="saveSettings">
        {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NotificationItem {
  key: string
  label: string
  description: string
  enabled: boolean
}

interface NotificationGroup {
  title: string
  description: string
  items: NotificationItem[]
}

const groups = reactive<NotificationGroup[]>([
  {
    title: 'Уведомления по Email',
    description: 'Выберите, какие письма вы хотите получать на почту',
    items: [
      { key: 'email_security', label: 'Безопасность', description: 'Входы с новых устройств, смена пароля и подозрительная активность', enabled: true },
      { key: 'email_activity', label: 'Активность аккаунта', description: 'Обновления лидов, изменения в рабочих пространствах и задачи', enabled: true },
      { key: 'email_product', label: 'Новости продукта', description: 'Анонсы функций, обновления и советы по использованию', enabled: false },
      { key: 'email_billing', label: 'Биллинг и оплата', description: 'Квитанции, предстоящие списания и уведомления о подписке', enabled: true },
    ],
  },
  {
    title: 'Push-уведомления',
    description: 'Уведомления прямо в браузере или мобильном приложении',
    items: [
      { key: 'push_leads', label: 'Новые лиды', description: 'Уведомления о новых контрагентах, найденных системой', enabled: true },
      { key: 'push_tasks', label: 'Задачи', description: 'Напоминания о дедлайнах и назначенных задачах', enabled: true },
      { key: 'push_team', label: 'Действия команды', description: 'Когда участники команды вносят изменения в общее пространство', enabled: false },
    ],
  },
  {
    title: 'Уведомления по SMS',
    description: 'Важные оповещения через текстовые сообщения',
    items: [
      { key: 'sms_security', label: 'Критическая безопасность', description: 'Только самые важные предупреждения о безопасности аккаунта', enabled: true },
      { key: 'sms_billing', label: 'Платёжные уведомления', description: 'Подтверждение транзакций и предупреждения о сбоях оплаты', enabled: false },
    ],
  },
])

const isSaving = ref(false)
const saved = ref(false)

// Snapshot defaults at mount time
const defaults = groups.map(g => ({
  key: g.title,
  items: g.items.map(i => ({ key: i.key, enabled: i.enabled })),
}))

async function saveSettings() {
  isSaving.value = true
  saved.value = false
  try {
    // TODO: await $fetch('/api/user/notifications', { method: 'PUT', body: { ... } })
    await new Promise(r => setTimeout(r, 600))
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } finally {
    isSaving.value = false
  }
}

function resetToDefault() {
  defaults.forEach(d => {
    const group = groups.find(g => g.title === d.key)
    d.items.forEach(di => {
      const item = group?.items.find(i => i.key === di.key)
      if (item) item.enabled = di.enabled
    })
  })
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
