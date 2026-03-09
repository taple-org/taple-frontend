// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true,},
  debug: true,
  runtimeConfig: {
    public: {
      apiBase: "",
    },
  },
  modules: ["@pinia/nuxt", "@regle/nuxt", "@nuxt/icon"],
  icon: {
    customCollections: [
      {
        prefix: "my-icon",
        dir: "./app/assets/icons",
      },
    ],
  },
});