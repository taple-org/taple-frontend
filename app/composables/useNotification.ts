import { createToaster } from '@ark-ui/vue/toast'

const toaster = createToaster({
  placement: 'top-end',
  overlap: true,
  gap: 16,
})

export function useNotification() {
  return {
    toaster,
    info(title: string, description?: string, duration?: number ) {
      toaster.create({ title, description, type: 'info', duration: duration })
    },
    success(title: string, description?: string, duration?: number) {
      toaster.create({ title, description, type: 'success', duration: duration })
    },
    warning(title: string, description?: string, duration?: number ) {
      toaster.create({ title, description, type: 'warning', duration: duration })
    },
    error(title: string, description?: string, duration?: number ) {
      toaster.create({ title, description, type: 'error', duration: duration })
    },
  }
}
