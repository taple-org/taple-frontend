import {TokenKey} from "~/constants/api.constants";

import {buildAuthRepository} from "~/repositories/auth.repository";
import {buildPostsRepository} from "~/repositories/posts.repository";
import type {SupabaseClient} from "@supabase/supabase-js";

export default defineNuxtPlugin({
    name: "http",
    dependsOn: ['supabase'],
    setup: nuxtApp => {
        const http = $fetch.create({
            baseURL: nuxtApp.$config.public.apiBase,
            onRequest: ({options}) => {
                if (import.meta.client) {
                    const token = localStorage.getItem(TokenKey);
                    if (token) {
                        options.headers.append('Authorization', `Bearer ${token}`);
                    }
                }
                options.headers.append('Accept', 'application/json');
            }
        })
        const auth = buildAuthRepository((nuxtApp.$supabase as SupabaseClient))
        const posts = buildPostsRepository(http)
        const api = { auth, posts }
        return {provide: {http, api}};
    }
})
