import type { RegleExternalErrorTree } from '@regle/core'
import {extractApiClientError} from "~/utils/extractApiClientError";

export const useWithLoadingStore = defineStore('with-loading', () => {
    const notification = useNotification()
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    function withLoading<T extends unknown[]>(
        fn: (...args: T) => Promise<void>,
        externalErrors?: Ref<RegleExternalErrorTree<any>>
    ) {
        return async (...args: T): Promise<boolean> => {
            isLoading.value = true
            error.value = null
            if (externalErrors) externalErrors.value = {}
            try {
                await fn(...args)
                return true
            } catch (e: unknown) {
                const apiClientError = extractApiClientError(e)
                if (apiClientError) {
                    error.value = apiClientError.message
                    if (externalErrors && apiClientError.fieldErrors) {
                        externalErrors.value = apiClientError.fieldErrors as RegleExternalErrorTree<any>
                    }
                    notification.error('Ошибка', apiClientError.message)
                } else if (e instanceof Error) {
                    error.value = e.message
                    notification.error('Ошибка', e.message)
                } else {
                    error.value = 'Неизвестная ошибка'
                    notification.error('Ошибка', 'Неизвестная ошибка')
                }
                return false
            } finally {
                isLoading.value = false
            }
        }
    }


    return {
        isLoading,
        error,
        withLoading,
    }
})
