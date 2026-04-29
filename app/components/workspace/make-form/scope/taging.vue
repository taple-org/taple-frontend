<script lang="ts" setup>
import { useTagingScope } from '~/composables/workspace/useWorkspaceFormScope';
import { useI18n } from "vue-i18n";
import { getLocalizedField } from "~/utils/localized";

const { $apiClient } = useNuxtApp();
const { locale } = useI18n();
const {data: categories} = useAsyncData(() => $apiClient.api.listAllApiV1CatalogCategoriesGet())

const businessCategories = computed(() => {
    if(!categories.value?.data) return [];
    return categories.value.data.result.map((category) => ({
        label: getLocalizedField(category as unknown as LocalizedRecord, "name", locale.value),
        id: category.id,
    }))
})

const { r$, trackErrors } = useTagingScope();


</script>
<template>
    <div class="taging-scope">
        <ui-fields-tag-field
            v-for="(track, index) in r$.$value.productTracks"
            :key="track.id"
            :label="track.label"
            :available-tags="businessCategories"
            :error="trackErrors[index]"
            v-model="track.business_categories"
        />
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
