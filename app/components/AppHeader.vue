<script lang="ts" setup>
import type { TemplateLink } from "~/interfaces/link";

const links: TemplateLink[] = [
  { to: "/contacts", label: "Контакты" },
  { to: "/tariffs", label: "Тарифы" },
  { to: "/api", label: "API" },
];
const isLoginOpen = ref(false);
const isSignupOpen = ref(false);

function openLoginDialog() {
  isLoginOpen.value = true;
}
function openSignupDialog() {
  isSignupOpen.value = true;
}
</script>
<template>
  <header class="header">
    <ui-container>
      <section class="content">
        <h1 class="logo" @click="console.log('here')">TAPLE</h1>
        <app-header-links :links />
        <div>
            <ui-button class="login-btn" @click="openLoginDialog">Войти</ui-button>    
            <ui-button class="signup-btn" @click="openSignupDialog">Зарегистрироваться</ui-button>
        </div>
        
        
      </section>
    </ui-container>
  </header>
  <ui-dialog v-model:open="isLoginOpen" title="Вход" description="Добро пожаловать в Taple.kz">
        <template #default>
            <login-form/>
        </template>
    </ui-dialog>
    <ui-dialog v-model:open="isSignupOpen" title="Регистрация" description="Добро пожаловать в Taple.kz">
        <template #default>
            <sign-up-form/>
        </template>
    </ui-dialog>
</template>

<style scoped>
:root {
  --content-gap: 40px;
}

.content {
  display: flex;
  gap: var(--content-gap);
  padding-block: 12px;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 24px;
  font-weight: 700;
}
</style>
