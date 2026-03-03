

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
                        <ui-button variant="outline">
                            Зарегистрироваться
                        </ui-button>
                    </form>
</template>