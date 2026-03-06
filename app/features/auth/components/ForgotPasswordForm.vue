<script lang="ts" setup>
import styles from '~/features/auth/index.module.css'
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';
import { useForgotPasswordForm } from '~/features/auth/composables/forms';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>();

const { r$ } = useForgotPasswordForm();

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const values = await r$.$validate();
    if(!values.valid) return;

    console.log(values.data);
    emit('go-to', 'reset-password');
}
</script>
<template>
    <form :class="styles.form" @submit="handleSubmit">
        <ui-form-field
        type="text" 
        v-model="r$.$value.email" 
        placeholder="Введите email" 
        :error="r$.email.$errors[0]"
        />
        <ui-button type="submit">Восстановить</ui-button>
        <span :class="styles.formText">или</span>
        <ui-button variant="outline" @click="emit('go-to', 'login')" type="button">Отменить</ui-button>
    </form>
</template>
<style lang="css">
.forgot-password-form{
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;

}
</style>