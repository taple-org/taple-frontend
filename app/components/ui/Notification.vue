<script setup lang="ts">
import { Toast, Toaster } from '@ark-ui/vue/toast'
import type { ToastType } from "@ark-ui/vue";

const { toaster } = useNotification()

const iconMap: Record<ToastType, string> = {
  info: "my-icon-info",
  success: "my-icon-success",
  warning: "my-icon-warning",
  error: "my-icon-error",
  loading: "my-icon-loading",
}
</script>

<template>
  <Teleport to="body">
    <Toaster v-slot="toast" :toaster="toaster">
      <Toast.Root class="notification" :class="`notification--${toast.type ?? 'info'}`">
        <Icon
            :name="iconMap[toast.type ?? 'info']!"
            class="notification__icon"
            size="24"
        />
        <div class="notification__content">
          <Toast.Title v-if="toast.title" class="notification__title">
            {{ toast.title }}
          </Toast.Title>
          <Toast.Description v-if="toast.description" class="notification__description">
            {{ toast.description }}
          </Toast.Description>
        </div>
        <Toast.CloseTrigger class="notification__close">
          <Icon name="my-icon-close" size="12" />
        </Toast.CloseTrigger>
      </Toast.Root>
    </Toaster>
  </Teleport>
</template>

<style scoped>
.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  min-width: 345px;
  max-width: 100%;
  background-color: var(--color-highlight-l);

  translate: var(--x) var(--y);
  scale: var(--scale);
  z-index: var(--z-index);
  opacity: var(--opacity);
  will-change: translate, opacity, scale;
  transition:
      translate 400ms,
      scale 400ms,
      opacity 400ms;
  transition-timing-function: cubic-bezier(0.21, 1.02, 0.73, 1);
}

.notification[data-state='closed'] {
  transition:
      translate 400ms,
      scale 400ms,
      opacity 200ms;
  transition-timing-function: cubic-bezier(0.06, 0.71, 0.55, 1);
}

.notification--info {
  background-color: var(--color-highlight-l);
}

.notification--info .notification__icon {
  color: var(--color-primary);
}

.notification--success {
  background-color: var(--color-success-l);
}

.notification--success .notification__icon {
  color: var(--color-success);
}

.notification--warning {
  background-color: var(--color-warning-l);
}

.notification--warning .notification__icon {
  color: var(--color-warning);
}

.notification--error {
  background-color: var(--color-error-l);
}

.notification--error .notification__icon {
  color: var(--color-error);
}

.notification__icon {
  flex-shrink: 0;
}

.notification__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.notification__title {
  font-family: var(--font-base), sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: normal;
  color: var(--color-neutral-dd);
  margin: 0;
}

.notification__description {
  font-family: var(--font-base), sans-serif;
  font-weight: 300;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: var(--color-neutral-dm);
  margin: 0;
}

.notification__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #71727A;
  cursor: pointer;
  transition: opacity var(--transition-base);
}

.notification__close:hover {
  opacity: 0.7;
}
</style>