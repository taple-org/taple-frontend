import { Api } from '~/api/generated/api';
import buildFetcher from '~/utils/buildFetcher';

export default defineNuxtPlugin({
    setup: (nuxtApp) => {
        const apiClient = new Api({
            baseUrl: nuxtApp.$config.public.apiBase,
            customFetch: buildFetcher
        })

        return { provide: { apiClient } };
    }
});
