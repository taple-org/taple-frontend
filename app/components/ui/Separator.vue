<script lang="ts" setup>
type Orientation = 'horizontal' | 'vertical'

const {
    orientation = 'horizontal',
    spacing = 16,
    color = 'currentColor',
    thickness = 1,
} = defineProps<{
  orientation?: Orientation
  spacing?: number | string
  color?: string
  thickness?: number | string
}>()


const norm = (v: number | string) =>
  typeof v === 'number' ? `${v}px` : v

const style = computed(() => {
  const isH = orientation === 'horizontal'
  return {
    margin: isH
      ? `${norm(spacing)} 0`
      : `0 ${norm(spacing)}`,
    borderWidth: isH
      ? `${norm(thickness)} 0 0 0`
      : `0 0 0 ${norm(thickness)}`,
    borderColor: color,
  }
})
</script>

<template>
  <hr :class="['separator', `separator--${orientation}`]" :style="style" />
</template>

<style scoped>
.separator {
  border-style: solid;
  width: auto;
  height: auto;
  align-self: stretch;
}

.separator--vertical {
  display: inline-block;
}
</style>