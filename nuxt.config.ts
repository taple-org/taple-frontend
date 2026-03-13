export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true,},
  runtimeConfig: {
    public: {
      apiBase: "",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
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
      },
      {
        prefix: 'other',
        dir: './app/assets/icons/other',
        recursive: true,
      }
    ],
  }
})