<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: "Taple — автопоиск бизнес-лидов",
  description: "Taple помогает автоматически находить свежие бизнес-лиды из открытых источников и работать с ними в едином интерфейсе.",
  ogTitle: "Taple — автопоиск бизнес-лидов",
  ogDescription: "Автоматический сбор, фильтрация и обработка бизнес-лидов для команд продаж.",
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
