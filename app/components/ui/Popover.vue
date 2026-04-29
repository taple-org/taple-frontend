<script lang="ts" setup>
import { computed } from 'vue'
import { Popover } from '@ark-ui/vue/popover'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  title?: string
  description?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  offset?: { mainAxis?: number; crossAxis?: number }
  closeOnInteractOutside?: boolean
}>()

const open = defineModel<boolean>('open')
const { t } = useI18n()

const positioning = computed(() => ({
  placement: props.placement ?? 'bottom',
  offset: {
    mainAxis: props.offset?.mainAxis ?? 8,
    crossAxis: props.offset?.crossAxis ?? 0,
  },
}))
</script>

<template>
  <Popover.Root
    v-model:open="open"
    :positioning="positioning"
    :close-on-interact-outside="closeOnInteractOutside ?? true"
    lazy-mount
    unmount-on-exit
  >
    <Popover.Trigger as-child>
        <slot name="trigger" />
    </Popover.Trigger>
    <Teleport to="body">
      <Popover.Positioner class="popover-positioner">
        <Popover.Content class="popover-content">
          <div v-if="title || description || $slots.header" class="popover-header">
            <slot name="header">
              <p v-if="title" class="popover-title">{{ title }}</p>
              <p v-if="description" class="popover-description">{{ description }}</p>
            </slot>
          </div>

          <div class="popover-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="popover-footer">
            <slot name="footer" />
          </div>

          <Popover.CloseTrigger v-if="$slots.close" class="popover-close" :aria-label="t('common.close')">
            <slot name="close" />
          </Popover.CloseTrigger>
        </Popover.Content>
      </Popover.Positioner>
    </Teleport>
  </Popover.Root>
</template>

<style>
.popover-trigger {
  display: contents;
}

.popover-positioner {
  z-index: 50 !important;
}

.popover-content {
  position: relative;
  background-color: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  border-radius: 10px;
  box-shadow: 0px 0px 4px 2px #0000001A;  
  width: max-content; 
  max-width: 90vw;   
  will-change: transform, opacity;
}

.popover-header {
  padding: 14px 36px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.popover-title {
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
  line-height: 1.4;
}

.popover-description {
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-neutral-ld);
  margin: 0;
  line-height: 1.5;
}

.popover-body {
  display: flex;
  flex-direction: column;
}

.popover-footer {
  padding: 0 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.popover-close {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-neutral-ld);
  font-size: 12px;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.popover-close:hover {
  background-color: var(--color-neutral-lm);
  color: var(--color-black);
}

.popover-content[data-placement^='bottom'][data-state='open']  { animation: popover-in-down  150ms ease forwards; }
.popover-content[data-placement^='top'][data-state='open']     { animation: popover-in-up    150ms ease forwards; }
.popover-content[data-placement^='right'][data-state='open']   { animation: popover-in-right 150ms ease forwards; }
.popover-content[data-placement^='left'][data-state='open']    { animation: popover-in-left  150ms ease forwards; }

@keyframes popover-in-down  { from { opacity: 0; transform: translate3d(0, -6px, 0); } to { opacity: 1; transform: none; } }
@keyframes popover-in-up    { from { opacity: 0; transform: translate3d(0,  6px, 0); } to { opacity: 1; transform: none; } }
@keyframes popover-in-right { from { opacity: 0; transform: translate3d(-6px, 0, 0); } to { opacity: 1; transform: none; } }
@keyframes popover-in-left  { from { opacity: 0; transform: translate3d( 6px, 0, 0); } to { opacity: 1; transform: none; } }
</style>
