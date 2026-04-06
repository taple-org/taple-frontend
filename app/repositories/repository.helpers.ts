import type { ApiResponse, ApiError } from '~/types/api.types'

type $Fetch = typeof $fetch;

/** Класс ошибки API — бросается при meta.code !== 0 */
export class ApiException extends Error {
    readonly code: number
    readonly apiError: ApiError

    constructor(code: number, apiError: ApiError) {
        const msg = apiError.message?.ru ?? apiError.message?.en ?? apiError.type ?? 'Unknown API error'
        super(msg)
        this.name = 'ApiException'
        this.code = code
        this.apiError = apiError
    }

    /** Получить ошибки полей (для отображения под инпутами, формат совместим с RegleExternalErrorTree) */
    get fieldErrors(): Record<string, string[]> | undefined {
        if (!this.apiError.fields) return undefined
        const result: Record<string, string[]> = {}
        for (const [field, messages] of Object.entries(this.apiError.fields)) {
            result[field] = [messages.ru ?? messages.en ?? '']
        }
        return result
    }
}

/** Извлекает result из обёртки { meta, result }, бросает ApiException при ошибке */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
    if (response.meta.code !== 0 && response.meta.error) {
        throw new ApiException(response.meta.code, response.meta.error)
    }
    return response.result
}

type PathParams<Url extends string> =
    Url extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? Param | PathParams<`/${Rest}`>
        : Url extends `${infer _Start}:${infer Param}`
            ? Param
            : never

type InferPathParams<Url extends string> = PathParams<Url> extends never
    ? Record<string, never>
    : { [K in PathParams<Url>]: string }


type RequestOptions<
    TPath extends Record<string, string>,
    TQuery extends Record<string, any>,
    TBody extends Record<string, any> | FormData | void,
    TResponse,
> = {
    path?: TPath
    query?: TQuery
    body?: TBody
    signal?: AbortSignal
    headers?: Record<string, string>
    timeout?: number
}

type Contract<
    Url extends string,
    TQuery extends Record<string, any>,
    TBody extends Record<string, any> | FormData | void,
    TResponse,
    TPath extends Record<string, string> = InferPathParams<Url>
> = {
    method: HttpMethod
    url: Url
    transform?: (raw: unknown) => TResponse
    defaultHeaders?: Record<string, string>
    _path?: TPath
    _query?: TQuery
    _body?: TBody
    _response?: TResponse
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type GetFunction<
    TPath extends Record<string, string>,
    TQuery extends Record<string, any>,
    TResponse
    > = (
        options: OmitEmpty<{
            path: TPath
            query: TQuery
            signal?: AbortSignal
            headers?: Record<string, string>
            timeout?: number
        }>
    ) => Promise<TResponse>

type MutationFunction<TPath extends Record<string, string>,
    TQuery extends Record<string, any>,
    TBody extends Record<string, any> | FormData | void,
    TResponse
    > = (
        options: OmitEmpty<{
            path: TPath
            query: TQuery
            body: TBody
            signal?: AbortSignal
            headers?: Record<string, string>
            timeout?: number
        }>
    ) => Promise<TResponse>

type OmitEmpty<T> = {
    [K in keyof T as T[K] extends Record<string, never> | void | undefined
        ? never
        : K
    ]: T[K]
} & {
    [K in keyof T as T[K] extends Record<string, never> | void | undefined
        ? K
        : never
    ]?: T[K]
}


type InferFunction<C extends Contract<any, any, any, any>> =
    C extends Contract<infer Url, infer TQuery, infer TBody, infer TResponse>
        ? C['method'] extends 'GET' | 'DELETE'
            ? GetFunction<InferPathParams<Url>, TQuery, TResponse>
            : MutationFunction<InferPathParams<Url>, TQuery, TBody, TResponse>
        : never

type ContractsMap = Record<string, Contract<any, any, any, any>>

type InferRepository<Contracts extends ContractsMap> = {
    [K in keyof Contracts]: InferFunction<Contracts[K]>
}


type ContractOptions<TResponse> = {
    transform?: (raw: unknown) => TResponse
    defaultHeaders?: Record<string, string>
}

export function get<
    TResponse = unknown,
    TQuery extends Record<string, any> = Record<string, never>,
    Url extends string = string
    >(
        url: Url,
    options?: ContractOptions<TResponse>
): Contract<Url, TQuery, void, TResponse> {
    return { method: 'GET', url, ...options }
}

export function post<
    TResponse = unknown,
    TBody extends Record<string, any> | FormData = Record<string, never>,
    TQuery extends Record<string, any> = Record<string, never>,
    Url extends string = string
    >(
        url: Url,
    options?: ContractOptions<TResponse>
): Contract<Url, TQuery, TBody, TResponse> {
    return { method: 'POST', url, ...options }
}

export function put<
    TResponse = unknown,
    TBody extends Record<string, any> | FormData = Record<string, never>,
    TQuery extends Record<string, any> = Record<string, never>,
    Url extends string = string
    >(
        url: Url,
    options?: ContractOptions<TResponse>
): Contract<Url, TQuery, TBody, TResponse> {
    return { method: 'PUT', url, ...options }
}

export function patch<
    TResponse = unknown,
    TBody extends Record<string, any> | FormData = Record<string, never>,
    TQuery extends Record<string, any> = Record<string, never>,
    Url extends string = string
    >(
        url: Url,
    options?: ContractOptions<TResponse>
): Contract<Url, TQuery, TBody, TResponse> {
    return { method: 'PATCH', url, ...options }
}

export function destroy<
    TResponse = unknown,
    TQuery extends Record<string, any> = Record<string, never>,
    Url extends string = string
    >(
        url: Url,
    options?: ContractOptions<TResponse>
): Contract<Url, TQuery, void, TResponse> {
    return { method: 'DELETE', url, ...options }
}


function resolveUrl(url: string, path?: Record<string, string>): string {
    if (!path) return url
    return url.replace(/:([a-zA-Z]+)/g, (_: string, key: string): string => {
        if (!(key in path)) throw new Error(`Missing path param: ${key}`)
        return path[key]!
    })
}


export function build<Contracts extends ContractsMap>(
    fetcher: $Fetch,
    contracts: Contracts
): InferRepository<Contracts> {
    const repository: any = {}

    for (const [name, contract] of Object.entries(contracts)) {
        repository[name] = async (options: RequestOptions<any, any, any, any> = {}) => {
            const { path, query, body, signal, headers, timeout } = options

            const resolvedUrl = resolveUrl(contract.url, path)

            const controller = signal ? undefined : new AbortController()
            const resolvedSignal = signal ?? controller?.signal

            const timeoutId = timeout && controller
                ? setTimeout(() => controller.abort(), timeout)
                : undefined

            try {
                const raw = await fetcher(resolvedUrl, {
                    method: contract.method,
                    query: query,
                    body: body ?? undefined,
                    signal: resolvedSignal,
                    headers: {
                        ...contract.defaultHeaders,
                        ...headers,
                    },
                })

                const unwrapped = unwrapApiResponse(raw as ApiResponse<unknown>)
                return contract.transform ? contract.transform(unwrapped) : unwrapped
            } catch (e: unknown) {
                // $fetch бросает FetchError при HTTP 4xx/5xx или при проблемах с сетью.
                // Пытаемся извлечь структурированную ошибку API из тела ответа.
                if (e && typeof e === 'object') {
                    const fe = e as any;
                    if (fe.data && typeof fe.data === 'object' && 'meta' in fe.data) {
                        unwrapApiResponse(fe.data as ApiResponse<unknown>)
                    }
                    
                    // Если это ошибка fetch и мы дошли сюда, значит нормального ответа от сервера нет
                    // Причина: сервер лежит (NetworkError), CORS, или сервер вернул не JSON (например HTML 502)
                    if (fe.name === 'FetchError' || (fe.message && fe.message.includes('<no response>'))) {
                        throw new ApiException(503, {
                            type: 'NetworkError',
                            message: {
                                ru: 'Ошибка сети. Сервер недоступен или не отвечает.',
                                en: 'Network error. Server is unreachable or unresponsive.'
                            }
                        })
                    }
                }
                throw e
            } finally {
                if (timeoutId) clearTimeout(timeoutId)
            }
        }
    }

    return repository as InferRepository<Contracts>
}