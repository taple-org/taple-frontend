<script lang="ts" setup>
import { useTagingScope, type ProductTrackWithCategories, type WithLabel } from '~/composables/workspace/useWorkspaceFormScope';

const { $apiClient } = useNuxtApp();
const {data: categories} = useAsyncData(() => $apiClient.api.listAllApiV1CatalogCategoriesGet())

const businessCategories = computed(() => {
    if(!categories.value?.data) return [];
    return categories.value.data.result.map((category) => ({ label: category.name_ru, id: category.id }))
})

const { data: products } = useAsyncData(() => $apiClient.api.listAllApiV1CatalogProductTracksGet()); 

const productTracks = computed<WithLabel<ProductTrackWithCategories>[]>(() => {
    if(!products.value?.data) return [];
    return products.value.data.result.map((pt, index) => ({
        id: pt.id,
        label: pt.name_ru,
        priority_order: index,
        business_categories: []
    })
)
})


const { r$ } = useTagingScope({ productTracks: productTracks.value });

</script>
<template>
    <div class="taging-scope">
        <ui-fields-tag-field v-for="track in r$.$value.productTracks" :key="track.id" :label="track.label"
            :available-tags="businessCategories" v-model="track.business_categories" />
    </div>
</template>
<style scoped>
.taging-scope {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.taging-scope .field {
    flex: 1 0 0;
}
</style>