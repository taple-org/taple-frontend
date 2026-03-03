type $Fetch = typeof $fetch;

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

                return contract.transform ? contract.transform(raw) : raw
            } finally {
                if (timeoutId) clearTimeout(timeoutId)
            }
        }
    }

    return repository as InferRepository<Contracts>
}