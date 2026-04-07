<script lang="ts" setup>
import { useAuthModalController } from "~/composables/modals/useAuthModalController";
import type { TemplateLink } from "~/interfaces/link.interfaces";

const links: TemplateLink[] = [
  { to: "#", label: "Контакты" },
  { to: "#tariffs", label: "Тарифы" },
  { to: "#", label: "API" },
];

const {open} = useAuthModalController();
const {isAuthenticated} = storeToRefs(useAuthStore());
</script>
<template>
  <header class="header">
    <ui-container>
      <section class="content">
        <app-header-logo title="TAPLE" />
        <app-header-links :links />
        <ui-button v-if="!isAuthenticated" @click="open('login')">Войти</ui-button>
        <app-header-profile v-else />
      </section>
    </ui-container>
  </header>
  <auth-modal />
  <workspace-make-form-modal />
</template>

<style scoped>
.header {
  box-shadow: var(--app-header-box-shadow);
  padding: var(--app-header-padding);

}

.content {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
}
</style>
