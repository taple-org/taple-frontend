<script setup lang="ts">

definePageMeta({
  title: "Home",
  layout: 'default'
})
const {$api} = useNuxtApp();
$api.auth.login({body: { email: 'd', passwword }})
</script>



<template>
</template>

<style scoped>

</style>
