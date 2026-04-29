<script lang="ts" setup>
import {
  useQueuingScope,
  type WithLabel,
  type ProductTrackWithCategories
} from '~/composables/workspace/useWorkspaceFormScope';
import {RecommendationCode} from "~/api/generated/api";
import { useI18n } from "vue-i18n";
import { getLocalizedField } from "~/utils/localized";

const { $apiClient } = useNuxtApp();
const { t, locale } = useI18n();

const { data: pts, error } = useAsyncData(() => $apiClient.api.listProductTracksApiV1CatalogProductTracksGet())

const productTracks = computed<WithLabel<ProductTrackWithCategories>[]>(() => {
  if(!pts.value?.data) return [];
  return pts.value.data.result.map((pt, index) => ({
        id: pt.id,
        label: getLocalizedField(pt as unknown as LocalizedRecord, "name", locale.value),
        priority_order: index,
        business_categories: (pt.business_categories ?? [])
            .filter((v) => v.recommendation_code === RecommendationCode.Recommended)
            .map((category) => ({
              label: getLocalizedField(category as unknown as LocalizedRecord, "name", locale.value),
              id: category.id,
            }))
      })
  )
})


const { r$ } = useQueuingScope(computed(() => ({ productTracks: productTracks.value })));

</script>
<template>
    <div class="queuing-scope">
        <ui-fields-sortable-field type="sortable" v-model="r$.$value.productTracks" :label="t('workspaceCreate.queueLabel')"
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
