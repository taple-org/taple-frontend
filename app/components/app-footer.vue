<script setup lang="ts">
import config from "~/configs/nav.config"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<template>
  <footer class="app-footer">
    <ui-container>
      <div class="app-footer__content">
        <app-footer-brand-section title="TAPLE" :description="t('footer.brandDescription')"
          :links="config.footer.Brand" />
        <app-footer-nav-section aria-label="Footer navigation" :nav-links="config.footer.Nav" />
      </div>
    </ui-container>
  </footer>
</template>
<style scoped>
.app-footer {
  box-shadow: var(--app-footer-box-shadow);
  padding: var(--app-footer-padding)
}

.app-footer__content {
  display: flex;
  justify-content: space-between;

  padding-block: var(--app-footer-content-padding);
}
</style>
