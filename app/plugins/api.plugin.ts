import { Api } from '~/api/generated/api';
import buildFetcher from '~/utils/buildFetcher';

export default defineNuxtPlugin({
    name: 'api',
    setup: (nuxtApp) => {
        const backendKey = nuxtApp.$config.public.backendKey;
        const apiBase = nuxtApp.$config.public.apiBase;
        const serverCookieHeader =
            nuxtApp.ssrContext?.event?.node?.req?.headers?.cookie ??
            nuxtApp.ssrContext?.event?.req?.headers?.cookie;

        const apiClient = new Api({
            baseUrl: nuxtApp.$config.public.apiBase,
            customFetch: buildFetcher(apiBase, backendKey, serverCookieHeader)
        })

        return { provide: { apiClient } };
    }
});
