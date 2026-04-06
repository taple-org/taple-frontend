import { TokenKey } from '~/constants/api.constants'

export default defineNuxtPlugin({
    name: 'http',
    setup: (nuxtApp) => {
        const http = $fetch.create({
            baseURL: nuxtApp.$config.public.apiBase,
            onRequest: ({ options }) => {
                if (import.meta.client) {
                    const token = localStorage.getItem(TokenKey)
                    if (token) {
                        options.headers.append('Authorization', `Bearer ${token}`)
                    }
                }
                options.headers.append('Accept', 'application/json')
            },
        })

        const api = {  }

        return { provide: { http, api } }
    },
})
