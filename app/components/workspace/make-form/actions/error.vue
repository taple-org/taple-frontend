<script lang="ts" setup>
import { useI18n } from "vue-i18n";

defineProps<{
    retry: () => any,
    prev: () => void
}>()

const { t } = useI18n();
</script>
<template>
    <div class="actions">
        <ui-button variant="outline" @click="prev">
            {{ t("common.back") }}
        </ui-button>
        <ui-button @click="retry">
            {{ t("common.retry") }}
        </ui-button>
    </div>
</template>
<style>
.actions{
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
