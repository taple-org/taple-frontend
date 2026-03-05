<script lang="ts" setup>
import type { TemplateLink } from '~/interfaces/link';

const links: TemplateLink[] = [
    { to: '/contacts', label: 'Контакты' },
    { to: '/tariffs', label: 'Тарифы' },
    { to: '/api', label: 'API' }
]
const isOpen = ref(false)

function openDialog(){
    isOpen.value = true
}


</script>
<template>
    <header class="header">
        <ui-container >
            <section class="content">
                <h1 class="logo" @click="console.log('here')">TAPLE</h1>
                <app-header-links :links />
                <ui-button class="login-btn" @click="openDialog">Войти</ui-button>
            </section>
        </ui-container>
    </header>
    <ui-dialog v-model:open="isOpen" title="Вход" description="Добро пожаловать в Taple.kz">
        <template #default>
            <login-form/>
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
</style>