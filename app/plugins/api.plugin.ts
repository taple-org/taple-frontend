import { Api } from '~/api/generated/api';
import buildFetcher from '~/utils/buildFetcher';

export default defineNuxtPlugin({
    setup: (nuxtApp) => {
        const backendKey = nuxtApp.$config.public.backendKey;
        const apiClient = new Api({
            baseUrl: nuxtApp.$config.public.apiBase,
            customFetch: (input, init) => buildFetcher(input, 
                {...init, headers: { ...init?.headers, "X-Backend-Key": backendKey } }
            )
        })

        return { provide: { apiClient } };
    }
});
