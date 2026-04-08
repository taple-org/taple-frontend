<script setup lang="ts">
import type { TemplateLink } from '~/interfaces/link.interfaces';

const { links } = defineProps<{
    links: TemplateLink[]
}>()
const isLastLink = (index: number) => index === links.length - 1 
</script>
<template>
    <ul class="links">
        <template v-for="({ to, label }, index) in links">
            <li class="links__item">
                <nuxt-link :to class="link">{{ label }}</nuxt-link>
            </li>
            <ui-separator class="links__separator" v-if="!isLastLink(index)" orientation="vertical" :thickness="2"
                color="#F4F5F6" />
        </template>
    </ul>
</template>
<style scoped lang="css">
.links {
    display: flex;
}

.links__item {
    padding: 9.5px 12px;

}

.link {
    font-weight: 700;
    font-size: 16px;
    color: var(--color-black);
    text-decoration: none;
}
</style>