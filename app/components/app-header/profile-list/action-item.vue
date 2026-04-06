<script setup lang="ts">
import styles from './index.module.css'
defineProps<{
    title: string,
    icon?: string,
    description?: string,
    action: () => void
}>()
</script>

<template>
    <article :class="[styles.item, styles.hoverable]" @click="action">
        <div v-if="icon" :class="[styles.item__icon, styles.hoverableIcon]">
            <Icon :name="icon" :size="20" />
        </div>
        <div :class="styles.item__textContent">
            <div :class="[styles.item__title, styles.hoverableTitle]">{{ title }}</div>
            <div :class="styles.item__description" v-if="description">{{ description }}</div>
        </div>
    </article>
</template>

<style scoped>
</style>