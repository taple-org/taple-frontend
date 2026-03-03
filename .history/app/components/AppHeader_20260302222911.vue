<script lang="ts" setup>


type Link = {
    to: string,
    label: string
}
const links: Link[] = [
    { to: '/contacts', label: 'Контакты' },
    { to: '/tariffs', label: 'Тарифы' },
    { to: '/api', label: 'API' }
] 
const open = ref(false)
const form = reactive<{ email: string, password: string }>({
    email: '',
    password: ''
})

const isLastLink = (index: number) => index === links.length - 1 
</script>
<template>
    <header class="header">
        <ui-container >
            <section class="content">
                <h1 class="logo" @click="console.log('here')">TAPLE</h1>
                <ul class="links">
                    <template v-for="({to, label}, index) in links">
                        <li class="links__link">
                            <nuxt-link :to class="link">{{ label }}</nuxt-link>
                        </li>
                        <ui-separator
                        v-if="!isLastLink(index)" 
                        orientation="vertical" 
                        :thickness="2" 
                        color="#F4F5F6" 
                       />

                    </template>
                </ul>
              <ui-button class="login-btn" @click="() => open = true">Войти</ui-button>
            </section>
        </ui-container>
    </header>
    <ui-dialog v-model:open="open" title="Вход" description="Добро пожаловать в Taple.kz">
                <template #default>
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
                        v-model=""
                        />
                        <ui-button>Войти</ui-button>
                        <ui-button variant="outline">
                            Зарегистрироваться
                        </ui-button>
                    </form>
                </template>
    </ui-dialog>
</template>

<style scoped>
:root {
    --content-gap: 40px;
}

.content{
    display: flex;
    gap: var(--content-gap);
    padding-block: 12px;
    align-items: center;
    justify-content: space-between;
}
.logo{
    font-size: 24px;
    font-weight: 700;
}
.links{
    display: flex;
}
.links__link{
    padding: 9.5px 12px;

}
.link{
    font-weight: 700;
    font-size: 16px;
    color: black;
    text-decoration: none;
}

.login-form{
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;

}


</style>