<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: "Мониторинг — Taple",
  description: "Мониторинг рабочих процессов и активности в рабочем пространстве Taple.",
  robots: "noindex, nofollow",
})

</script>
<template>
    <div class="leads">
        <h1 class="leads__title">Leads</h1>
        <p class="leads__description">Here you can manage your leads and track their progress through the sales funnel.</p>
        <ui-button color="primary" size="medium">Add New Lead</ui-button>
    </div>
</template>
