<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: t("seo.api.title"),
  description: t("seo.api.description"),
  ogTitle: t("seo.api.ogTitle"),
  ogDescription: t("seo.api.ogDescription"),
})
</script>

<template>
  <landing-api-section />
</template>
