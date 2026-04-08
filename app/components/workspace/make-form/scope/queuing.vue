<script lang="ts" setup>
import { useQueuingScope, type ProductTrack, type WithLabel } from '~/composables/workspace/useWorkspaceFormScope';
const { $apiClient } = useNuxtApp();
const { data: products, error } = useAsyncData(() => $apiClient.api.listAllApiV1CatalogProductTracksGet())

const productTracks = computed<WithLabel<ProductTrack>[]>(() => {
    if (!products.value?.data) return [];

    return [
        ...products.value.data.result.map((pt, index) => ({
            id: pt.id,
            label: pt.name_ru,
            priority_order: index,
        }))
    ]
})


const { r$ } = useQueuingScope(computed(() => ({ productTracks: productTracks.value })));

</script>
<template>
    <div class="queuing-scope">
        <ui-fields-sortable-field type="sortable" v-model="r$.$value.productTracks" label="Введите название очереди"
            class="field" />
    </div>
</template>
<style scoped>
.queuing-scope {
    display: flex;
    gap: 10px;
}

.queuing-scope .field {
    flex: 1 0 0;
}
</style>