<script lang="ts" setup>
import { Switch } from '@ark-ui/vue/switch'

const model = defineModel<boolean>({ default: false })

const { disabled = false } = defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <Switch.Root
    class="switch"
    :checked="model"
    :disabled="disabled"
    @checked-change="(e) => (model = e.checked)"
  >
    <Switch.Control class="switch__control">
      <Switch.Thumb class="switch__thumb" />
    </Switch.Control>
    <Switch.HiddenInput />
  </Switch.Root>
</template>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.switch[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch__control {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 24px;
  padding: 3px;
  border-radius: 100px;
  background: var(--color-neutral-lm);
  border: none;
  transition: background var(--transition-base), box-shadow var(--transition-base);
}

.switch__control[data-state='checked'] {
  justify-content: flex-end;
  background: var(--color-primary);
}

.switch__control[data-focus-visible] {
  outline: 2px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
  outline-offset: 2px;
}

.switch__thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-white);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}
</style>
