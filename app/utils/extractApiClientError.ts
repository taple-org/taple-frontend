export function extractApiClientError(e: unknown): { message: string; fieldErrors?: Record<string, string[]> } | null {
    if (e === null || typeof e !== 'object' || e instanceof Error) return null
    const resp = e as Record<string, unknown>
    if (typeof resp.status !== 'number' || !('error' in resp)) return null

    const body = resp.error as Record<string, unknown> | null | undefined
    if (!body) return { message: 'Неизвестная ошибка' }

    const meta = body.meta as Record<string, unknown> | undefined
    if (meta?.error) {
        const apiError = meta.error as {
            message?: Record<string, string>
            type?: string
            fields?: Record<string, Record<string, string>>
        }
        const message = apiError.message?.ru ?? apiError.message?.en ?? apiError.type ?? 'Ошибка'
        const fieldErrors: Record<string, string[]> = {}
        if (apiError.fields) {
            for (const [field, msgs] of Object.entries(apiError.fields)) {
                fieldErrors[field] = [msgs.ru ?? msgs.en ?? '']
            }
        }
        return { message, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined }
    }

    if (Array.isArray(body.detail)) {
        const details = body.detail as Array<{ loc?: (string | number)[]; msg?: string }>
        const fieldErrors: Record<string, string[]> = {}
        for (const ve of details) {
            const field = ve.loc?.[ve.loc.length - 1]
            if (field && typeof field === 'string') {
                if (!fieldErrors[field]) fieldErrors[field] = []
                if (ve.msg) fieldErrors[field].push(ve.msg)
            }
        }
        const message = details[0]?.msg ?? 'Ошибка валидации'
        return { message, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined }
    }

    return { message: 'Неизвестная ошибка' }
}