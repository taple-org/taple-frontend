<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: t("seo.home.title"),
  description: t("seo.home.description"),
  ogTitle: t("seo.home.ogTitle"),
  ogDescription: t("seo.home.ogDescription"),
})
</script>

<template>
  <landing-hero />
  <landing-value-section />
  <landing-features-section />
  <landing-how-it-works-section />
  <landing-comparison-section />
  <landing-contact-section />
</template>
