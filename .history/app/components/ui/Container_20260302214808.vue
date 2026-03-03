<script lang="ts" setup>
import { computed } from 'vue'

type PaddingValue = string | number
type Padding = [PaddingValue, PaddingValue?, PaddingValue?, PaddingValue?]

const { padding = [0, 15] } = defineProps<{
  padding?: Padding
}>()

const normValue = (v: PaddingValue | undefined) =>
  typeof v === 'number' ? `${v}px` : (v ?? '')

const containerStyle = computed(() => {
  return { padding: padding.map(normValue).join(' ') }
})
</script>

<template>
  <div class="container" :style="containerStyle">
    <slot />
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
  
}
</style>