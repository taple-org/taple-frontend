
<script>
const form = reactive<{ email: string, password: string, rememberMe: boolean }>({
    email: '',
    password: '',
    rememberMe: false
})
</script>
<template>
    <form class="login-form" @submit="console.log('')">
        <ui-form-field
        type="text" 
        v-model="form.email" 
        placeholder="Введите email" 
        required
        />
        <ui-form-field 
        type="password" 
        v-model="form.password" 
        placeholder="Введите пароль" 
        required
        />
        <ui-form-field 
        type="checkbox"
        v-model="form.rememberMe"
        label="Запомнить меня"
        />
        <ui-button>Войти</ui-button>
        <nuxt-link to="#" class="to-tutorial">Впервые на нашем сайте?</nuxt-link>
        <ui-button variant="outline">Зарегистрироваться</ui-button>
    </form>
</template>
<style lang="css">
.login-form{
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;

}
.to-tutorial{
    font-family: 'StyreneALC';
    font-size: 12px;
    font-weight: 300;
    text-align: center;
    color: var(--color-neutral-dd)
}

</style>