// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true,},
  runtimeConfig: {
    public: {
      apiBase: "",
    },
  },
  modules: ['@pinia/nuxt', '@regle/nuxt', '@nuxt/icon'],
  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'my',
        dir: './app/assets/icons/my',
        recursive: true,
      }
    ],
  }
})