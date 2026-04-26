<script lang="ts" setup>
import { WorkspaceMakeFormModal } from "#components";
import { useAuthModalController } from "~/composables/modals/useAuthModalController";
import type { TemplateLink } from "~/interfaces/link.interfaces";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const links = computed<TemplateLink[]>(() => [
  { to: "/contacts", label: t("nav.contacts") },
  { to: "/api", label: "API" },
  { to: "/tariffs", label: t("nav.pricing") },
]);
const { open } = useAuthModalController();
const { isAuthenticated } = storeToRefs(useAuthStore());
</script>
<template>
  <header class="header">
    <ui-container>
      <section class="content">
        <app-header-logo title="TAPLE" />
        <app-header-links :links />
        <client-only>
          <ui-button v-if="!isAuthenticated" @click="open('login')">
            {{ t("auth.login") }}
          </ui-button>
          <app-header-profile v-else />
          <template #fallback>
            <ui-button disabled>{{ t("auth.login") }}</ui-button>
          </template>
        </client-only>
      </section>
    </ui-container>
  </header>
  <auth-modal />
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
