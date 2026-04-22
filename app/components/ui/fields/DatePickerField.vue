<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <ui-date-picker
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
