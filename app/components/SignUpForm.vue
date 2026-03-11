
<script lang="ts" setup>
const form = reactive<{ email: string, password: string, rememberMe: boolean }>({
    email: '',
    password: '',
    rememberMe: false
})
</script>
<template>
    <form class="signup-form" @submit="console.log('')">
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
        type="password" 
        v-model="form.password" 
        placeholder="Подтвердите пароль" 
        required
        />
        <ui-info-section>
            Пароль должен состоять минимум из 8 символов и содержать (заглавную букву, цифру и специальный символ) 
        </ui-info-section>
        <ui-form-field 
        type="checkbox"
        v-model="form.rememberMe"
        label="Я ознакомился(лась) с условиями сервиса и полностью согласен(а) с ними."
        />
        <ui-button>Продолжить</ui-button>
        <p class="to-tutorial">У вас уже есть учетная запись?</p>
        <ui-button variant="outline">Войти</ui-button>
    </form>
</template>
<style lang="css">
.signup-form{
    max-width: 425px;
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
