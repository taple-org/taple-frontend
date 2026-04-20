<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: "Дэшборд рабочего пространства — Taple",
  description: "Обзор статистики и ключевых показателей рабочего пространства в Taple.",
  robots: "noindex, nofollow",
})

const period = ref(['today'])

const periodItems = [
  { value: 'today', label: 'Сегодня' },
  { value: 'yesterday', label: 'Вчера' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
]
</script>
<template>
  <div class="dashboard">
    <h2 class="dashboard__title">Статистика рабочего пространства</h2>
    <ui-content-switcher v-model="period" :items="periodItems" />

  </div>
</template>

<style scoped>
.dashboard__title{
  font-size: 34px;
  font-weight: bold;
}
.dashboard{
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 64px;
  padding-right: 64px;
  align-items: center;
}
</style>
