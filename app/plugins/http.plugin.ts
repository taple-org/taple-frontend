import { TokenKey } from '~/constants/api.constants'
import { buildAuthRepository } from '~/repositories/auth.repository'
import { buildPostsRepository } from '~/repositories/posts.repository'

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

        const auth = buildAuthRepository(http)
        const posts = buildPostsRepository(http)
        const api = { auth, posts }

        return { provide: { http, api } }
    },
})
