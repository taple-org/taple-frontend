export function until(source: Ref<boolean>) {
  return {
    toBe: (value: boolean) => {
      if (source.value === value) return Promise.resolve()

      return new Promise<void>((resolve) => {
        const stop = watch(source, (val) => {
          if (val === value) {
            stop()
            resolve()
          }
        })
      })
    }
  }
}