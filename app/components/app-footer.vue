<script setup lang="ts">
import { AppFooterLinks } from "~/constants/nav.constants"

</script>
<template>
  <footer class="app-footer">
    <ui-container>
      <div class="app-footer__content">
        <app-footer-brand-section
            title="TAPLE"
            description="Descriptive line about what your company does."
            :links="AppFooterLinks.Brand"
        />
        <app-footer-nav-section
            aria-label="Footer navigation"
            :nav-links="AppFooterLinks.Nav"
        />
      </div>
    </ui-container>
  </footer>
</template>
<style scoped>
.app-footer {
  box-shadow: var(--app-footer-box-shadow);
  padding: var(--app-footer-padding)
}
.app-footer__content{
  display: flex;
  justify-content: space-between;

  padding-block: var(--app-footer-content-padding);
}
</style>
