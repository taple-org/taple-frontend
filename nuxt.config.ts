export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: "",
      backendKey: ""
    },
  },
  modules: ["@pinia/nuxt", "@regle/nuxt", "@nuxt/icon", "@nuxt/eslint"],


  eslint: {
    config: {
      standalone: false,
    },
  },

  icon: {
    mode: "svg",
    customCollections: [
      {
        prefix: "my-icon",
        dir: "./app/assets/icons",
        recursive: true,
      }
    ],
  },
  vite: {
    optimizeDeps: {
      include: [
        "@ark-ui/vue/toast",
        "@ark-ui/vue/steps",
        "@ark-ui/vue/dialog",
        "@regle/rules",
        "@regle/core",
        "@ark-ui/vue/popover",
        "@ark-ui/vue/field",
        "@ark-ui/vue/pin-input",
        "@ark-ui/vue/checkbox",
        "@ark-ui/vue/select",
        "@ark-ui/vue",
        "@ark-ui/vue/password-input",
        '@formkit/drag-and-drop/vue',
        '@formkit/drag-and-drop',
        '@ark-ui/vue/progress'
      ],
    },
  },
});
