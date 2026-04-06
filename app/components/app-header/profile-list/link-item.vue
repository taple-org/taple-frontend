<script setup lang="ts">
import styles from './index.module.css'
defineProps<{
    title: string,
    to: string,
    icon?: string,
    description?: string,
}>()
</script>
<template>
    <nuxt-link :class="styles.item__link" :to>
        <article :class="[styles.item, styles.hoverable]">
            <div v-if="icon" :class="[styles.item__icon, styles.hoverableIcon]">
                <Icon :name="icon" :size="20" />
            </div>
            <div :class="styles.item__textContent">
                <div :class="[styles.item__title, styles.hoverableTitle]">{{ title }}</div>
                <div :class="styles.item__description" v-if="description">
                    {{ description }}
                </div>
            </div>
        </article>
    </nuxt-link>
</template>
<style scoped>
</style>