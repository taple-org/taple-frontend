<script lang="ts" setup>
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false })

defineProps<{
  title?: string;
  description?: string;
  persistent?: boolean;
}>();

const open = defineModel<boolean>("open");
</script>

<template>
  <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit :closeOnInteractOutside="!persistent">
    <Teleport to="body">
      <Dialog.Backdrop class="ui-modal-backdrop" />
      <Dialog.Positioner class="ui-modal-positioner">
        <Dialog.Content class="ui-modal-content">
          <div class="ui-modal-header">
            <div v-if="$slots.header"><slot name="header" /></div>
            <div v-else class="ui-modal-header__text">
              <Dialog.Title class="ui-modal-header__title">{{ title }}</Dialog.Title>
              <Dialog.Description v-if="description" class="ui-modal-header__description">{{ description }}</Dialog.Description>
            </div>
          </div>
          <div class="ui-modal-body"><slot /></div>
          <div v-if="$slots.footer" class="ui-modal-footer"><slot name="footer" /></div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<style>
.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}
.ui-modal-backdrop[data-state="open"] { animation: ui-modal-backdrop-in 150ms ease forwards; }
.ui-modal-backdrop[data-state="closed"] { animation: ui-modal-backdrop-out 120ms ease forwards; }

.ui-modal-positioner {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
  pointer-events: none;
}

.ui-modal-content {
  position: relative;
  background-color: var(--color-secondary);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  width: fit-content;
  min-width: 320px;
  max-width: min(1000px, calc(100vw - 32px));
  overflow: hidden;
  pointer-events: all;
  contain: layout style;
}
.ui-modal-content[data-state="open"] { animation: ui-modal-content-in 150ms ease forwards; }
.ui-modal-content[data-state="closed"] { animation: ui-modal-content-out 120ms ease forwards; }

.ui-modal-header { position: relative; padding: 30px 30px 0; }
.ui-modal-header__text { display: flex; flex-direction: column; gap: 4px; text-align: center; }
.ui-modal-header__title { font-family: var(--font-base); font-size: 22px; font-weight: 700; color: var(--color-black); line-height: 1.3; margin: 0; }
.ui-modal-header__description { font-size: 11px; font-weight: 300; color: var(--color-black); line-height: 1.5; margin: 0; }
.ui-modal-body { padding: 0 30px 30px; display: flex; flex-direction: column; gap: 16px; }
.ui-modal-footer { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 10px; }

@keyframes ui-modal-backdrop-in  { from { will-change: opacity; opacity: 0; } to { opacity: 1; } }
@keyframes ui-modal-backdrop-out { from { will-change: opacity; opacity: 1; } to { opacity: 0; } }
@keyframes ui-modal-content-in   { from { will-change: transform, opacity; opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes ui-modal-content-out  { from { will-change: transform, opacity; opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(0, 8px, 0); } }
</style>
