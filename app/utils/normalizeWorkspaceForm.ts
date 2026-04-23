import { toRaw } from "vue";
import type { CollectedScopes } from "~/composables/workspace/useWorkspaceFormScope";
import type { TenantCreate } from "~/api/generated/api";

export function normalizeWorkspaceForm(value: CollectedScopes): TenantCreate {
  const raw = toRaw(value);

  return {
    name: raw.naming.name,
    city_id: raw.naming.city,
    product_tracks: raw.taging.productTracks.map((productTrack) => ({
      product_track_id: productTrack.id,
      priority_order: productTrack.priority_order,
      business_category_ids: productTrack.business_categories.map((category) => category.id),
    })),
  };
}
