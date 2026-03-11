
<script lang="ts" setup>
import { useSignUpForm } from '~/features/auth/composables/useSignUpForm';
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>()

const {r$} = useSignUpForm()
const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const values = await r$.$validate()
    console.log(values)
}

</script>
<template>
    <form class="signup-form" @submit="handleSubmit">
        <ui-form-field
        type="text" 
        v-model="r$.$value.email" 
        :error="r$.email.$errors[0]"
        placeholder="Введите email" 

        />
        <ui-form-field 
        type="password" 
        v-model="r$.$value.password" 
        :error="r$.password.$errors[0]"
        placeholder="Введите пароль" 
        />
        <ui-form-field 
        type="password" 
        v-model="r$.$value.confirmPassword" 
        :error="r$.confirmPassword.$errors[0]"
        placeholder="Подтвердите пароль" 
        />
        <ui-info-section size="md">
            Пароль должен состоять минимум из 8 символов и содержать (заглавную букву, цифру и специальный символ) 
        </ui-info-section>
        <ui-form-field 
        type="checkbox"
        v-model="r$.$value.agree"
        :error="r$.agree.$errors[0]"
        label="Я ознакомился(лась) с условиями сервиса и полностью согласен(а) с ними."
        />
        <ui-button type="submit">Продолжить</ui-button>
        <span class="to-tutorial">У вас уже есть учетная запись?</span>
        <ui-button variant="outline" type="button" @click.prevent="emit('go-to', 'login')">Войти</ui-button>
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
    color: var(--color-neutral-dd);
}


</style>
