export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: "",
      backendKey: "",
    },
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // Security headers including CSP
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for Nuxt hydration
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '0; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
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
      },
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
        "@formkit/drag-and-drop/vue",
        "@formkit/drag-and-drop",
        "@ark-ui/vue/progress",
        "@ark-ui/vue/toggle-group",
        "@ark-ui/vue/tabs",
      ],
    },
  },
});
