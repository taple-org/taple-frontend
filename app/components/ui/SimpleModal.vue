<script lang="ts" setup>
import { Dialog } from '@ark-ui/vue/dialog'

defineOptions({ inheritAttrs: false })

defineProps<{
  title?: string
  description?: string
}>()
defineEmits<{ close: [] }>()

const open = defineModel<boolean>('open')

</script>

<template>
  <Dialog.Root v-model:open="open" @update:open="v => !v && $emit('close')" lazy-mount unmount-on-exit>
    <Teleport to="body">
      <Dialog.Backdrop class="simple-modal-backdrop" />
      <Dialog.Positioner class="simple-modal-positioner">
        <Dialog.Content class="simple-modal-content">
          <slot />
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<style>
.simple-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}
.simple-modal-backdrop[data-state="open"]  { animation: simple-modal-backdrop-in 150ms ease forwards; }
.simple-modal-backdrop[data-state="closed"] { animation: simple-modal-backdrop-out 120ms ease forwards; }

.simple-modal-positioner {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
  pointer-events: none;
}

.simple-modal-content {
  position: relative;
  background-color: var(--color-secondary);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  width: fit-content;
  min-width: 320px;
  max-width: min(1000px, calc(100vw - 32px));
  pointer-events: all;
  contain: layout style;
}
.simple-modal-content[data-state="open"]  { animation: simple-modal-content-in 150ms ease forwards; }
.simple-modal-content[data-state="closed"] { animation: simple-modal-content-out 120ms ease forwards; }

@keyframes simple-modal-backdrop-in  { from { will-change: opacity; opacity: 0; } to { opacity: 1; } }
@keyframes simple-modal-backdrop-out { from { will-change: opacity; opacity: 1; } to { opacity: 0; } }
@keyframes simple-modal-content-in   { from { will-change: transform, opacity; opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes simple-modal-content-out  { from { will-change: transform, opacity; opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(0, 8px, 0); } }
</style>
