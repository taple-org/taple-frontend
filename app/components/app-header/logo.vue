<script lang="ts" setup>
defineProps<{
    title: string
}>();
</script>
<template>
    <h1 class="logo" @click="$router.push('/')">
        {{ title }}
    </h1>
</template>
<style lang="css" scoped>
.logo {
  font-size: 24px;
  font-weight: 700;
}
</style>