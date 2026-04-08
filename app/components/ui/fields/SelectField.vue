<script lang="ts" setup>
import { computed } from 'vue'
import { Select } from '@ark-ui/vue/select'
import { createListCollection } from '@ark-ui/vue'
import type { SelectOption } from './registry'
const props = defineProps<{
  modelValue: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const collection = computed(() =>
  createListCollection({
    items: props.options,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
  })
)

const selected = computed(() => (props.modelValue ? [props.modelValue] : []))

function handleValueChange(details: { value: string[] }) {
  emit('update:modelValue', details.value[0] ?? '')
}
</script>

<template>
  <Select.Root :collection="collection" :value="selected" :disabled="disabled" @value-change="handleValueChange">
    <Select.Control class="select__control">
      <Select.Trigger class="select__trigger">
        <Select.ValueText class="select__value" :placeholder="placeholder ?? 'Выберите...'" />
        <Select.Indicator class="select__indicator">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </Select.Indicator>
      </Select.Trigger>
    </Select.Control>

    <Select.Positioner>
      <Select.Content class="select__content">
        <Select.Item v-for="option in options" :key="option.value" :item="option" class="select__item">
          <Select.ItemText class="select__item-text">
            {{ option.label }}
          </Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Positioner>
  </Select.Root>
</template>

<style scoped>
.select__control {
  position: relative;
  width: 100%;
}

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-base);
  font-size: 14px;
  padding: 16px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  background-color: var(--color-secondary);
  color: var(--color-neutral-dd);
  cursor: pointer;
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.select__trigger:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.select__trigger[data-state='open'] {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.select__trigger[data-invalid] {
  border-color: var(--color-error);
}

.select__trigger[data-invalid]:focus-visible,
.select__trigger[data-invalid][data-state='open'] {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.select__trigger[data-disabled] {
  background-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}

.select__value[data-placeholder-shown] {
  color: var(--color-neutral-dl);
}

.select__indicator {
  display: flex;
  align-items: center;
  color: var(--color-neutral-ld);
  transition: transform var(--transition-base);
  flex-shrink: 0;
}

.select__trigger[data-state='open'] .select__indicator {
  transform: rotate(180deg);
}

.select__content {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  padding: 12px;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-neutral-dd) 10%, transparent);
  min-width: var(--reference-width);
  z-index: 50;
  outline: none;
}

.select__content[data-state='open'] {
  animation: select-open 0.15s ease;
}

.select__content[data-state='closed'] {
  animation: select-close 0.1s ease;
}

@keyframes select-open {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes select-close {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: calc(var(--radius-md) - 2px);
  cursor: pointer;
  font-family: var(--font-base);
  font-size: 14px;
  color: var(--color-neutral-dd);
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  outline: none;
  transition: background-color var(--transition-base);

  margin-bottom: 8px;
}

.select__item[data-highlighted] {
  background-color: var(--color-neutral-lm);
}

.select__item[data-state='checked'] {
  color: var(--color-primary);
  font-weight: 600;
}

.select__item-indicator {
  display: flex;
  align-items: center;
  color: var(--color-primary);
}
</style>