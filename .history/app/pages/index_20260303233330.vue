<script setup lang="ts">

definePageMeta({
  title: "Home",
  layout: 'default'
})
const {$api} = useNuxtApp();
$api.auth.login({body: {  }})
</script>



<template>
</template>

<style scoped>

</style>
