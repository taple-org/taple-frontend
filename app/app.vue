<script lang="ts" setup >
useFontsLoader()

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