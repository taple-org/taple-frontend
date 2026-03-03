<script setup lang="ts">
const { } = defineProps<{
    links: Link[]
}>()
const isLastLink = (index: number) => index === links.length - 1 
</script>
<template>
    <ul class="links">
        <template v-for="({ to, label }, index) in links">
            <li class="links__link">
                <nuxt-link :to class="link">{{ label }}</nuxt-link>
            </li>
            <ui-separator v-if="!isLastLink(index)" orientation="vertical" :thickness="2" color="#F4F5F6" />

        </template>
    </ul>
</template>