<script lang="ts" setup>
import { Dialog } from '@ark-ui/vue/dialog'

defineOptions({ inheritAttrs: false })

defineProps<{
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <div>
    <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit>
      <Teleport to="body">
        <Dialog.Backdrop class="dialog-backdrop" />
        <Dialog.Positioner class="dialog-positioner">
          <Dialog.Content
            class="dialog-content"
            :class="[`dialog-content--${size ?? 'md'}`]"
          >
            <div class="dialog-header">
              <div v-if="$slots.header">
                <slot name="header" />
              </div>
              <div v-else class="dialog-header__text">
                <Dialog.Title class="dialog-header__title">
                  {{ title }}
                </Dialog.Title>
                <Dialog.Description v-if="description" class="dialog-header__description">
                  {{ description }}
                </Dialog.Description>
              </div>

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

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  will-change: opacity;
}
.dialog-backdrop[data-state='open']  { animation: dialog-backdrop-in  150ms ease forwards; }
.dialog-backdrop[data-state='closed'] { animation: dialog-backdrop-out 120ms ease forwards; }

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
  background-color: var(--color-secondary);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  pointer-events: all;
  will-change: transform, opacity;
}

.dialog-content--sm { max-width: 380px; }
.dialog-content--md { max-width: 480px; }
.dialog-content--lg { max-width: 600px; }


.dialog-content[data-state='open']   { animation: dialog-content-in  150ms ease forwards; }
.dialog-content[data-state='closed'] { animation: dialog-content-out 120ms ease forwards; }

.dialog-header {
  position: relative;
  padding: 30px 30px 0;
}

.dialog-header__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.dialog-header__title {
  font-family: var(--font-base);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.3;
  margin: 0;
}

.dialog-header__description {
  font-size: 11px;
  font-weight: 300;
  color: var(--color-black);
  line-height: 1.5;
  margin: 0;
}

.dialog-close:hover {
  background-color: color-mix(in srgb, var(--color-neutral-lm) 80%, var(--color-black));
}

.dialog-body {
  padding: 20px 30px 30px;
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
  from { opacity: 0; transform: translate3d(0, 8px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes dialog-content-out {
  from { opacity: 1; transform: translate3d(0, 0,   0);    }
  to   { opacity: 0; transform: translate3d(0, 8px, 0); }
}
</style>