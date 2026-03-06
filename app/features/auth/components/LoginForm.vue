<script lang="ts" setup>
import { useLoginForm } from '~/features/auth/composables/useLoginForm';
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>()

const { r$ } = useLoginForm();

const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const values = await r$.$validate()
    console.log(values)
}
</script>
<template>
    <form class="login-form" @submit="handleSubmit">
        <ui-form-field
        type="text" 
        v-model="r$.$value.email" 
        placeholder="Введите email" 
        :error="r$.email.$errors[0]"
        />
        <ui-form-field 
        type="password" 
        v-model="r$.$value.password" 
        placeholder="Введите пароль" 
        :error="r$.password.$errors[0]"
        />
        <div class="inline">
            <ui-form-field 
            type="checkbox" 
            v-model="r$.$value.rememberMe" 
            :error="r$.rememberMe.$errors[0]"
            label="Запомнить меня" />
            <nuxt-link to="" @click.prevent="emit('go-to', 'forgot-password')" class="forget-password">Забыли пароль?</nuxt-link>
        </div>
        <ui-button type="submit">Войти</ui-button>
        <nuxt-link to="#" class="to-tutorial">Впервые на нашем сайте?</nuxt-link>
        <ui-button variant="outline" @click="emit('go-to', 'signup')" type="button">Зарегистрироваться</ui-button>
        <ui-info-section size="sm">
            Я пользователь информационной системы «Taple», продолжая работу на портале подтверждаю свое согласие, что несу ответственность за все осуществленные действия в соответствии с законодательством Республики Казахстан
        </ui-info-section>
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
    color: var(--color-neutral-dd);

}
.forget-password{
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    font-family: var(--font-base);
    color: var(--color-highlight-d);
}
.inline{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>