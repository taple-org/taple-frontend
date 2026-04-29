<script lang="ts" setup>
import { computed } from 'vue'
import { Select } from '@ark-ui/vue/select'
import { createListCollection } from '@ark-ui/vue'
import { useI18n } from 'vue-i18n'
import type { SelectOption } from './registry'

const props = defineProps<{
  modelValue: string[]
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const { t } = useI18n()

const collection = computed(() =>
    createListCollection({
      items: props.options,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.label,
    })
)

const displayText = computed(() => {
  if (!props.modelValue?.length) return null
  if (props.modelValue.length === props.options.length) {
    return t("common.allSelected")
  }

  const labels = props.options
    .filter((o) => props.modelValue.includes(o.value))
    .map((o) => o.label)

  if (labels.length <= 2) return labels.join(', ')
  return `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`
})
</script>

<template>
  <Select.Root
      multiple
      :collection="collection"
      :model-value="modelValue ?? []"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
      lazy-mount
      unmount-on-exit
  >
    <Select.Control class="select__control">
      <Select.Trigger class="select__trigger">
        <span class="select__value" :data-placeholder-shown="!displayText || undefined">
          {{ displayText ?? placeholder ?? t("common.select") }}
        </span>
        <div class="select__meta">
          <span v-if="modelValue?.length" class="select__count">
            {{ modelValue.length }}
          </span>
          <Select.Indicator class="select__indicator">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Select.Indicator>
        </div>
      </Select.Trigger>
    </Select.Control>

    <Teleport to="body">
      <Select.Positioner class="select__positioner">
        <Select.Content class="select__content">
        <Select.Item
            v-for="option in options"
            :key="option.value"
            :item="option"
            class="select__item"
        >
          <span class="select__item-checkbox">
            <svg
                v-if="modelValue?.includes(option.value)"
                width="12" height="12" viewBox="0 0 12 12"
                fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <Select.ItemText class="select__item-text">
            {{ option.label }}
          </Select.ItemText>
        </Select.Item>
        </Select.Content>
      </Select.Positioner>
    </Teleport>
  </Select.Root>
</template>

<style scoped>

.select__control { position: relative; width: 100%; }

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 140px;
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  padding: 8px 14px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: 12px;
  background-color: var(--color-secondary);
  color: var(--color-neutral-dd);
  cursor: pointer;
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base);
  min-height: 52px;
  gap: 10px;
}

.select__trigger:focus-visible,
.select__trigger[data-state='open'] {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.select__trigger[data-invalid] { border-color: var(--color-error); }
.select__trigger[data-invalid]:focus-visible,
.select__trigger[data-invalid][data-state='open'] {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.select__trigger[data-disabled] {
  background-color: var(--color-neutral-ll);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}

.select__value {
  display: flex;
  flex: 1;
  min-width: 0;
  color: var(--color-neutral-dd);
  line-height: 1.35;
}

.select__value[data-placeholder-shown] {
  color: var(--color-neutral-dl);
}

.select__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.select__count {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background-color: var(--color-neutral-ll);
  color: var(--color-neutral-dm);
  font-size: 12px;
  font-weight: 700;
}

.select__indicator {
  display: flex;
  align-items: center;
  color: var(--color-neutral-dl);
  transition: transform var(--transition-base);
}

.select__trigger[data-state='open'] .select__indicator { transform: rotate(180deg); }

.select__content {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  padding: 8px;
  border-radius: 14px;
  box-shadow: 0 14px 34px color-mix(in srgb, var(--color-neutral-dd) 12%, transparent);
  min-width: min(320px, calc(100vw - 24px));
  max-width: min(360px, calc(100vw - 24px));
  max-height: min(320px, calc(100vh - 24px));
  overflow-y: auto;
  z-index: 220;
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: var(--color-neutral-ld) transparent;
}

.select__positioner {
  z-index: 220;
}

.select__content::-webkit-scrollbar {
  width: 10px;
}

.select__content::-webkit-scrollbar-track {
  background: transparent;
}

.select__content::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-neutral-ld) 80%, white);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.select__content[data-state='open'] { animation: select-open 0.15s ease; }
.select__content[data-state='closed'] { animation: select-close 0.1s ease; }

@keyframes select-open {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes select-close {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-4px); }
}

.select__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  color: var(--color-neutral-dd);
  font-weight: 400;
  line-height: 20px;
  outline: none;
  transition: background-color var(--transition-base);
}

.select__item[data-highlighted] { background-color: var(--color-neutral-ll); }
.select__item[data-state='checked'] { color: var(--color-primary); font-weight: 600; }

.select__item-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-neutral-lm);
  border-radius: 4px;
  flex-shrink: 0;
  transition: border-color var(--transition-base), background-color var(--transition-base);
  color: var(--color-primary);
}

.select__item[data-state='checked'] .select__item-checkbox {
  border-color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
</style>
