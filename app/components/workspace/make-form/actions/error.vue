<script lang="ts" setup>
defineProps<{
    retry: () => any,
    prev: () => void
}>()
</script>
<template>
    <div class="actions">
        <ui-button variant="outline" @click="prev">
            Назад
        </ui-button>
        <ui-button @click="retry">
            Повторить
        </ui-button>
    </div>
</template>