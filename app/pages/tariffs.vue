<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: t("seo.pricing.title"),
  description: t("seo.pricing.description"),
  ogTitle: t("seo.pricing.ogTitle"),
  ogDescription: t("seo.pricing.ogDescription"),
})
</script>

<template>
  <landing-pricing-section />
</template>

<style scoped></style>
