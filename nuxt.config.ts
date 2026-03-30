export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, },
  runtimeConfig: {
    public: {
      apiBase: "",
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || "",
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