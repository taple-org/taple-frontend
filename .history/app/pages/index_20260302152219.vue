<script setup lang="ts">

definePageMeta({
  title: "Home",
  layout: 'default'
})
const {$api} = useNuxtApp();
const {} = useAsyncData("login", () => $api.auth.login())

</script>



<template>
</template>

<style scoped>

</style>
