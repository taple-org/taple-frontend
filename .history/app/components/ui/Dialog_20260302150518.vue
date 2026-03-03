 <script lang="ts" setup>
import { Dialog } from '@ark-ui/vue/dialog'
import { XIcon } from 'lucide-vue-next'
defineOptions({
  inheritAttrs: false
})
const props = defineProps<{
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <div>
  <Dialog.Root 
  v-model:open="open"
  lazy-mount
  unmount-on-exit
  >
    <Teleport to="body">
      <Dialog.Backdrop class="dialog-backdrop" />
      <Dialog.Positioner class="dialog-positioner">
        <Dialog.Content
          class="dialog-content"
          :class="[`dialog-content--${size ?? 'md'}`]"
        >
          <div class="dialog-header">
            <div v-if="$slots.header">
              <slot name="header"></slot>
            </div>
            <div v-else class="dialog-header__text">
              <Dialog.Title class="dialog-header__title">
                {{ title }}
              </Dialog.Title>
              <Dialog.Description v-if="description" class="dialog-header__description">
                {{ description }}
              </Dialog.Description>
            </div>
            <Dialog.CloseTrigger class="dialog-close" aria-label="Close">
              <XIcon :size="18" />
            </Dialog.CloseTrigger>
          </div>

          <div class="dialog-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="dialog-footer">
            <slot name="footer" />
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
  </div>
</template>


<style lang="scss">
@use "~/assets/css/global" as global;
@use "sass:map";
@use "sass:color";


$primary:    map.get(global.$colors, primary);
$secondary:  map.get(global.$colors, secondary);
$neutral-lm: map.get(global.$colors, neutral-lm);
$neutral-ld: map.get(global.$colors, neutral-ld);
$label:      #1A1A2E;

$transition: 200ms ;

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 100;

  &[data-state='open']  { animation: dialog-backdrop-in  $transition forwards; }
  &[data-state='closed'] { animation: dialog-backdrop-out $transition forwards; }
}

.dialog-positioner {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
  pointer-events: none; 
}

.dialog-content {
  position: relative;
  background-color: $secondary;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  pointer-events: all; 

  &--sm { max-width: 380px; }
  &--md { max-width: 460px; }
  &--lg { max-width: 600px; }

  &[data-state='open']  { animation: dialog-content-in  $transition forwards; }
  &[data-state='closed'] { animation: dialog-content-out $transition forwards; }
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 24px 0;

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-family: "StyreneALC", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: $label;
    line-height: 1.3;
    margin: 0;
  }

  &__description {
    font-size: 13px;
    color: $neutral-ld;
    line-height: 1.5;
    margin: 0;
  }
}

.dialog-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background-color: $neutral-lm;
  color: $label;
  cursor: pointer;
  transition: background-color $transition, color $transition;
  margin-top: -2px;

  &:hover {
    background-color: color.adjust($neutral-lm, $lightness: -5%);
  }
}

.dialog-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-footer {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@keyframes dialog-backdrop-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialog-backdrop-out { from { opacity: 1; } to { opacity: 0; } }

@keyframes dialog-content-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}
@keyframes dialog-content-out {
  from { opacity: 1; transform: translateY(0)    scale(1);    }
  to   { opacity: 0; transform: translateY(12px) scale(0.97); }
}
</style>