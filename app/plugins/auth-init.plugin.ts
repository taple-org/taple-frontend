export default defineNuxtPlugin({
    name: 'auth-init',
    dependsOn: ['api'],
    setup: async () => {
    const authStore = useAuthStore()
    await authStore.initSession()
    }
})