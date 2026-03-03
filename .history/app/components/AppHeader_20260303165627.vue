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


const isLastLink = (index: number) => index === links.length - 1 
</script>
<template>
    <header class="header">
        <ui-container >
            <section class="content">
                <h1 class="logo" @click="console.log('here')">TAPLE</h1>
              <ui-button class="login-btn" @click="() => open = true">Войти</ui-button>
            </section>
        </ui-container>
    </header>
    <ui-dialog v-model:open="open" title="Вход" description="Добро пожаловать в Taple.kz">
        <template #default>
            <login-form />
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
    color: var(--color-black);
    text-decoration: none;
}

</style>