<script lang="ts" setup>
import { ToggleGroup } from '@ark-ui/vue/toggle-group'

export type ContentSwitcherItem = {
  value: string
  label: string
}

const props = defineProps<{
  items: ContentSwitcherItem[]
}>()

const model = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <ToggleGroup.Root
    v-model="model"
    :deselectable="false"
    class="content-switcher"
  >
    <ToggleGroup.Item
      v-for="item in props.items"
      :key="item.value"
      :value="item.value"
      class="content-switcher__item"
    >
      {{ item.label }}
    </ToggleGroup.Item>
  </ToggleGroup.Root>
</template>

<style scoped>
.content-switcher {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 16px;
  background-color: #F8F9FE;
  isolation: isolate;
}

.content-switcher__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;

  font-family: var(--font-base);
  font-weight: 700;
  font-size: 12px;
  line-height: normal;
  text-align: center;
  color: #71727A;

  position: relative;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.content-switcher__item[data-state='on'] {
  background-color: var(--color-primary);
  color: var(--color-highlight-l);
}

.content-switcher__item:not([data-state='on']):hover {
  background-color: color-mix(in srgb, #F8F9FE 80%, #71727A);
}

/* Dividers between inactive items */
.content-switcher__item:not([data-state='on']) + .content-switcher__item:not([data-state='on'])::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 10px;
  background-color: #C5C6CC;
}
</style>
