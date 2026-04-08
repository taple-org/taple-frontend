<script setup lang="ts">
import styles from './index.module.css'
import type { ProfileListItem } from '~/interfaces/profile.interfaces';

defineProps<{
    title: string,
    icon?: string,
    description?: string,
    items: ProfileListItem[]
}>();

const open = ref(false);

function toggle() {
    open.value = !open.value;
}
</script>

<template>
    <div class="nested">
        <article class="nested__trigger" :class="[styles.item, styles.hoverable]" @click="toggle">
            <div v-if="icon" :class="[styles.item__icon, styles.hoverableIcon]">
                <Icon :name="icon" :size="20" />
            </div>
            <div :class="styles.item__textContent">
                <div :class="[styles.item__title, styles.hoverableTitle]">{{ title }}</div>
                <div :class="styles.item__description" v-if="description">{{ description }}</div>
            </div>
            <span class="nested__arrow" :class="{ 'nested__arrow--open': open }">
                <Icon name="my-icon:arrow-down" :size="16" />
            </span>
        </article>

        <Transition name="sublist">
            <ul v-if="open" class="nested__sublist">
                <li v-for="item in items" :key="item.title">
                    <app-header-profile-list-link-item v-if="item.type === 'link'" v-bind="item" />
                    <app-header-profile-list-action-item v-else-if="item.type === 'action'" v-bind="item" />
                    <app-header-profile-list-nested-item v-else-if="item.type === 'nested'" v-bind="item" />
                </li>
            </ul>
        </Transition>
    </div>
</template>

<style scoped>
.nested__trigger {
    cursor: pointer;
    user-select: none;
}

.nested__arrow {
    margin-left: auto;
    color: var(--color-neutral-md);
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
}

.nested__arrow--open {
    transform: rotate(180deg);
}

.nested__sublist {
    padding-top: 10px;
    display: grid;
    row-gap: 10px;
    column-gap: 10px;
    align-self: stretch;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sublist-enter-active,
.sublist-leave-active {
    transition:
        max-height 0.35s ease,
        opacity 0.3s ease;
    max-height: 500px;
    opacity: 1;
}

.sublist-enter-from,
.sublist-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>