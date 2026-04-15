<template>
  <div class="settings-layout">
    <app-header />
    <div class="settings-page">
      <settings-side-bar />
      <main class="settings-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SettingsLayout' })
</script>

<style scoped>
.settings-layout {
  min-height: 100vh;
  background: var(--color-neutral-ll);
}

.settings-page {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  max-width: 1060px;
  margin: 40px auto;
  padding: 0 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .settings-page {
    grid-template-columns: 1fr;
    margin: 16px auto;
  }
}
</style>