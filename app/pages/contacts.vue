<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: t("seo.contacts.title"),
  description: t("seo.contacts.description"),
  ogTitle: t("seo.contacts.ogTitle"),
  ogDescription: t("seo.contacts.ogDescription"),
})
</script>

<template>
  <landing-contact-section />
</template>
