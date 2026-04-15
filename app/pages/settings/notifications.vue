<template>
  <div class="notifications-page">
    <div class="page-header">
      <h1 class="page-title">Уведомления</h1>
      <p class="page-desc">Настройте, как и когда вы хотите получать уведомления</p>
    </div>

    <settings-notifications-form />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })
</script>

<style scoped>
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.page-desc {
  font-size: 14px;
  color: var(--color-neutral-dl);
}
</style>
