<script lang="ts" setup>
import styles from '~/features/auth/index.module.css'
import { useResetPasswordForm } from '~/features/auth/composables/forms';
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>()

const { r$ } = useResetPasswordForm();

const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const values = await r$.$validate()
     if(!values.valid) return;

    console.log(values.data);
    emit('go-to', 'login');
}
</script>
<template>
    <form :class="styles.form" @submit="handleSubmit">
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
        <ui-button type="submit">Установить</ui-button>
        <span :class="styles.formText">или</span>
        <ui-button variant="outline" @click="emit('go-to', 'login')" type="button">Отменa</ui-button>
    </form>
</template>
<style scoped lang="css">
.reset-password-form{
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;

}
</style>