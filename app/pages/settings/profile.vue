<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">{{ t("settings.profile") }}</h1>
      <p class="page-desc">{{ t("settings.profileDesc") }}</p>
    </div>

    <settings-avatar-upload />
    <settings-profile-form />
    <settings-email-section />
    <settings-phone-section />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
definePageMeta({ layout: "settings" });
</script>

<style scoped>
.profile-page {
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
