import { required, withMessage,  } from "@regle/rules";
import { createScopedUseRegle, type Maybe } from "@regle/core";
import type { TenantCreate, ResponseTenantRead, ProductTrackItem } from "~/api/generated/api";

export type WithLabel<T> = T & { label: string }
export type WithId<T> = T & { id: string }

export type ProductTrack = {
    id: string;
    priority_order: number;
}

export type BusinessCategory = WithLabel<WithId<{}>>;
export type ProductTrackWithCategories = ProductTrack & {
  business_categories: BusinessCategory[];
}


type NamingScopeState = {
  name: string;
  city: string;
};

type QueuingScopeState = {
  productTracks: WithLabel<ProductTrackWithCategories>[];
};

type TagingScopeState = {
  productTracks: WithLabel<ProductTrackWithCategories>[];
};

export type CollectedScopes = {
  naming: NamingScopeState;
  queuing: QueuingScopeState;
  taging: TagingScopeState;
};

const { useCollectScope, useScopedRegle } = createScopedUseRegle({
  asRecord: true,
});

type UseWorkspaceFormProps = {
    current: MaybeRefOrGetter<keyof CollectedScopes>
    next: () => void,
    beforeSubmit?: () => void;
    catchError?: (error: unknown) => void;
    resolve?: (data : ResponseTenantRead) => void;
    
}

export const useWorkspaceForm = ({ current, next, beforeSubmit, catchError, resolve }: UseWorkspaceFormProps) => {
  const { r$: scope } = useCollectScope<CollectedScopes>();
  const { $apiClient } = useNuxtApp()
  async function toNext() {
    const result = await scope[toValue(current)].$validate();
    if (!result.valid) return;

    switch (toValue(current)){
        case 'queuing': {
            scope.taging.$value.productTracks = scope.queuing.$value.productTracks
            break;
        }
    }
    next();
  }

  async function handleSubmit() {
    beforeSubmit && beforeSubmit()
    try {
      const {valid, data, errors} = await scope.$validate();
      if (!valid) {
        catchError && catchError(errors)
        return;
      }

      function normalizer(scope: CollectedScopes): TenantCreate{
        const productTracks = scope.taging
        .productTracks.map((pt) => ({
          product_track_id: pt.id,
          priority_order: pt.priority_order,
          business_category_ids: pt.business_categories.map((bc) => bc.id),
        }) )
        return {
          name: scope.naming.name,
          city_id: scope.naming.city,
          product_tracks: productTracks
        }
      }
      const normalizedData = normalizer(scope.$value)
      
      const response = await $apiClient.api.createTenantApiV1TenantsPost(normalizedData, {  });
      resolve && resolve(response.data);

      return response;
    } catch(e) {
        catchError && catchError(e)
    }
  }

  return { toNext, handleSubmit }
};

export const useNamingScope = () => {
  const state = reactive<NamingScopeState>({ name: "", city: "" });

  const { r$ } = useScopedRegle(
    state,
    {
      name: {
        required: withMessage(required, "Это поле обязательно для заполнения"),
      },
      city: {
        required: withMessage(required, "Это поле обязательно для заполнения"),
      },
    },
    { id: "naming" },
  );

  return { r$ };
};

export const useQueuingScope = (initialValues: MaybeRef<QueuingScopeState>) => {
  const state = reactive<QueuingScopeState>({ productTracks: [] });
  watch(
    () => toValue(initialValues).productTracks,
    (val) => { state.productTracks = val },
    { immediate: true }
  );

  const { r$ } = useScopedRegle(
    state,
    {
      productTracks: {
        required: withMessage(required, "Это поле обязательно для заполнения"),
      },
    },
    { id: "queuing" },
  );

  return { r$ };
};

const allTracksHaveCategories = createRule({
    validator(value: Maybe<WithLabel<ProductTrackWithCategories>[]>) {
        return (value ?? []).every(track => track.business_categories.length > 0);
    },
    message: "Необходимо выбрать хотя бы один тэг для каждого направления"
});


export const useTagingScope = () => {
    const state = reactive<TagingScopeState>({
        productTracks: []
    });
    const {r$} = useScopedRegle(
        state,
        {
            productTracks: {
                required: withMessage(required, "Это поле обязательно для заполнения"),
                allTracksHaveCategories
            },
        },
        {id: "taging"},
    );
    const trackErrors = computed(() =>
        state.productTracks.map(track =>
            track.business_categories.length === 0 ? "Необходимо выбрать хотя бы один тэг" : undefined
        )
    );

    return {r$, trackErrors};
};
