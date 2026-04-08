<script setup lang="ts">
import type { TemplateLink } from "~/interfaces/link.interfaces";
defineProps<{
  title: string;
  description: string;
  links: TemplateLink[];
}>()
</script>
<template>
  <div class="brand">
    <h2 class="brand__title">{{ title }}</h2>
    <p class="brand__desc">{{ description }}</p>
    <div class="brand__social social">
      <template v-for="{ icon, label, ...props } in links">
        <nuxt-link class="social__link" v-bind="props">
          <icon v-if="!!icon" class="social__icon" v-bind="icon" />
        </nuxt-link>
      </template>
    </div>
  </div>
</template>
<style scoped>
.brand__title {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-neutral-dd);
  padding-bottom: 8px;
}

.brand__desc {
  font-size: 16px;
  font-weight: 400;
  color: var(--color-neutral-dl);
  padding-bottom: 56px;
}

.social {
  display: flex;
  gap: 24px;
}

.social__icon {
  width: 24px;
  height: 24px;
  color: var(--color-neutral-dl);
}
</style>
