<template>
  <div class="settings-app">
    <app-header />
    <div class="settings-page">
      <settings-side-bar />
      <main class="settings-main">
        <slot />
      </main>
    </div>
    <auth-modal />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SettingsLayout' })
</script>

<style scoped>
.settings-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-neutral-ll);
}

.settings-page {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  max-width: 1060px;
  width: 100%;
  margin: 40px auto;
  padding: 0 24px;
  align-items: start;
  flex: 1;
}

@media (max-width: 768px) {
  .settings-page {
    grid-template-columns: 1fr;
    margin: 16px auto;
  }
}
</style>
