export default defineNuxtPlugin({
  name: 'init',
  dependsOn: ['api'],
  parallel: true,
  async setup(app){
    const authStore = useAuthStore();

    if(import.meta.browser){
        await authStore.initSession();

      app.hook('app:suspense:resolve', function(){
        authStore.hydrated();
      });
    }
    else{
      authStore.user = null;
    }
  }
});