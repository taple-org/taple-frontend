export default defineNuxtPlugin({
  name: 'init',
  dependsOn: ['api'],
  parallel: true,
  async setup(){
    const authStore = useAuthStore();

    if(import.meta.browser){
        await authStore.initSession();
    }
  }
});