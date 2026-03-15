export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, },
  runtimeConfig: {
    public: {
      apiBase: "",
      supabaseUrl: "",
      supabaseKey: "",
    },
  },
  modules: ['@pinia/nuxt', '@regle/nuxt', '@nuxt/icon', '@nuxt/eslint',],
  eslint: {
    config: {
      standalone: false
    }
  },
  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'my',
        dir: './app/assets/icons/my',
        recursive: true,
      },
      {
        prefix: 'my-icon',
        dir: './app/assets/icons',
        recursive: true,
      }
    ],

  }
})