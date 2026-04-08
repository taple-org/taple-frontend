<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
console.log(props.error)
</script>

<template>
  <div>
    <h1>{{ error }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>