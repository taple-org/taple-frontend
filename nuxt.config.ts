// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "",
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase", "@nuxt/icon"],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register'],
    }
  },
  icon: {
    customCollections: [
      {
        prefix: "my-icon",
        dir: "./app/assets/icons",
      },
    ],
  },
});