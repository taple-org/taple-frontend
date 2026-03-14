<script lang="ts" setup>
import type { TemplateLink } from "~/interfaces/link";
const links: TemplateLink[] = [
  { to: "#", label: "Контакты" },
  { to: "#tariffs", label: "Тарифы" },
  { to: "#", label: "API" },
];
const { open } = useAuthDialog()


</script>
<template>
  <header class="header">
    <ui-container>
      <section class="content">
        <h1 class="logo">TAPLE</h1>
        <app-header-links :links />
        <ui-button class="login-btn" @click="() => {console.log('click'); open('login')}">Войти</ui-button>
      </section>
    </ui-container>
  </header>
  <auth-dialog/>
</template>

<style scoped>

.header{
  box-shadow: var(--app-header-box-shadow);
  padding: var(--app-header-padding);

}
.content {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 24px;
  font-weight: 700;
}

</style>
