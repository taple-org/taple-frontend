<script lang="ts" setup>
import { useNamingScope } from '~/composables/workspace/useWorkspaceFormScope';

const { r$ } = useNamingScope();
const { data: cities, error } = useAsyncData(
    (nuxtApp) => nuxtApp.$apiClient.api.listAllApiV1CatalogCitiesGet()
        .then(cs => cs.data.result)
        .then(r => r.map((city) => ({ value: city.id, label: city.name_ru })))
)
const options = computed(() => cities.value ?? []);


</script>
<template>
    <div class="naming-scope">
        <ui-form-field type="text" v-model="r$.$value.name" :error="r$.$errors.name[0]"
            placeholder="Введите название рабочего пространства" class="field" />
        <ui-form-field type="select" v-model="r$.$value.city" :error="r$.$errors.city[0]" 
        :options="options" placeholder="Введите название района" class="field" />
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