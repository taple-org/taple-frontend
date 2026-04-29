<script lang="ts" setup>
import { useNamingScope } from '~/composables/workspace/useWorkspaceFormScope';
import { useI18n } from "vue-i18n";
import { getLocalizedField } from "~/utils/localized";

const { r$ } = useNamingScope();
const { t, locale } = useI18n();
const { data: cities, error } = useAsyncData(
    (nuxtApp) => nuxtApp.$apiClient.api.listAllApiV1CatalogCitiesGet()
        .then(cs => cs.data.result)
        .then(r => r.map((city) => ({
            value: city.id,
            label: getLocalizedField(city as unknown as LocalizedRecord, "name", locale.value),
        })))
)
const options = computed(() => cities.value ?? []);


</script>
<template>
    <div class="naming-scope">
        <ui-form-field type="text" v-model="r$.$value.name" :error="r$.$errors.name[0]"
            :placeholder="t('workspaceCreate.namePlaceholder')" class="field" />
        <ui-form-field type="select" v-model="r$.$value.city" :error="r$.$errors.city[0]" 
        :options="options" :placeholder="t('workspaceCreate.cityPlaceholder')" class="field" />
    </div>
</template>
<style scoped>
.naming-scope {
    display: flex;
    gap: 10px;
}

.naming-scope .field {
    flex: 1 0 0;
}
</style>
