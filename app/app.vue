<script lang="ts" setup>
useFontsLoader();

// Initialize locale from localStorage or cookie on client side
const { setLocale } = useI18n();

if (import.meta.client) {
  const savedLocale =
    localStorage.getItem("i18n_locale") || useCookie("i18n_locale").value;
  if (savedLocale && ["en", "ru", "kk"].includes(savedLocale)) {
    setLocale(savedLocale as "en" | "ru" | "kk");
  }
}
</script>
<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <ClientOnly>
    <ui-notification />
  </ClientOnly>
</template>
<style src="~/assets/css/global.css"></style>
