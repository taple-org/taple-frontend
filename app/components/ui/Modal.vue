<script lang="ts" setup>
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });

defineProps<{
  title?: string;
  description?: string;
  persistent?: boolean;
}>();

const open = defineModel<boolean>("open");
</script>

<template>
  <div>
    <Dialog.Root
      v-model:open="open"
      lazy-mount
      unmount-on-exit
      :closeOnInteractOutside="!persistent"
    >
      <Teleport to="body">
        <Dialog.Backdrop class="dialog-backdrop" />
        <Dialog.Positioner class="dialog-positioner">
          <Dialog.Content class="dialog-content">
            <div class="dialog-header">
              <div v-if="$slots.header">
                <slot name="header" />
              </div>
              <div v-else class="dialog-header__text">
                <Dialog.Title class="dialog-header__title">
                  {{ title }}
                </Dialog.Title>
                <Dialog.Description
                  v-if="description"
                  class="dialog-header__description"
                >
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
/*
  Backdrop: убираем backdrop-filter — он форсирует отдельный compositor layer
  на весь viewport и является главной причиной фризов при открытии/закрытии.
  Заменяем на чуть более плотный rgba без blur — визуально почти неотличимо,
  производительность кардинально лучше.

  will-change убираем с постоянного места и выставляем только в момент
  анимации через @keyframes — браузер сам продвигает элемент в отдельный
  слой только пока он нужен.
*/
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  /* НЕТ backdrop-filter: blur() — главный виновник фризов */
  /* НЕТ постоянного will-change */
}

.dialog-backdrop[data-state="open"] {
  animation: dialog-backdrop-in 150ms ease forwards;
}

.dialog-backdrop[data-state="closed"] {
  animation: dialog-backdrop-out 120ms ease forwards;
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
  /*
    contain: layout style — изолирует layout и style recalc внутри модалки,
    браузер не пересчитывает остальную страницу при изменениях внутри.
  */
  contain: layout style;
}

.dialog-content[data-state="open"] {
  animation: dialog-content-in 150ms ease forwards;
}

.dialog-content[data-state="closed"] {
  animation: dialog-content-out 120ms ease forwards;
}

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

.dialog-body {
  padding: 0 30px 30px;
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

/*
  will-change ставим только внутри @keyframes — браузер создаёт
  compositor layer лишь на время анимации и сразу освобождает память.
*/
@keyframes dialog-backdrop-in {
  from {
    will-change: opacity;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-backdrop-out {
  from {
    will-change: opacity;
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes dialog-content-in {
  from {
    will-change: transform, opacity;
    opacity: 0;
    transform: translate3d(0, 8px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes dialog-content-out {
  from {
    will-change: transform, opacity;
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 8px, 0);
  }
}
</style>
