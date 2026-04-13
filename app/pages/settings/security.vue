<template>
  <div class="security-page">
    <div class="page-header">
      <h1 class="page-title">Безопасность</h1>
      <p class="page-desc">Управляйте паролем, двухфакторной аутентификацией и активными сессиями</p>
    </div>

    <settings-password-form />
    <settings-danger-zone />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })
</script>

<style scoped>
.security-page {
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