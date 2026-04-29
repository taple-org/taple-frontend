<script setup lang="ts">
import type { NavSection } from "~/interfaces/link.interfaces";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps<{
  navLinks: NavSection[]
}>();
</script>
<template>
  <nav class="nav-section">
    <template v-for="[heading, links] in navLinks">
      <div class="nav-section__col">
        <h3 class="nav-section__heading">{{ t(heading) }}</h3>
        <ul class="nav-section__list">
          <li v-for="{ label, ...props } in links" class="nav-section__item">
            <nuxt-link class="nav-section__link" v-if="label" v-bind="props">
              {{ t(label) }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
<style scoped>
.nav-section {
  display: flex;
  gap: 40px;
}

.nav-section__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-section__heading {
  font-size: 15px;
  line-height: 145%;
  font-weight: bold;
  padding-bottom: 24px;

}

.nav-section__link {
  font-size: 14px;
  line-height: 145%;
  font-weight: 400;
  color: var(--color-neutral-dl);
}
</style>
