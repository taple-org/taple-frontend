import type { AuthUser } from "~/types/api.types";
import { required, minLength } from "@regle/rules";
import { useI18n } from "#imports";

export interface IProfileFormState {
  first_name: string;
  last_name: string;
  language: string;
}

function normalizeProfile(
  user?: AuthUser | null,
  currentLocale?: string,
): IProfileFormState {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    language: (user as any)?.language ?? currentLocale ?? "en",
  };
}

export const useProfileForm = (user?: Ref<AuthUser | null>) => {
  const { locale } = useI18n();

  const state = reactive<IProfileFormState>({
    ...normalizeProfile(user?.value, locale.value),
  });

  watch(
    user ?? ref(null),
    (value) => {
      Object.assign(state, normalizeProfile(value, locale.value));
    },
    { immediate: true },
  );

  const { t } = useI18n();

  const { r$ } = useRegle(state, {
    first_name: {
      required: withMessage(required, t("validation.required")),
      minLength: withMessage(
        minLength(2),
        t("validation.minLength", { count: 2 }),
      ),
    },
    last_name: {
      required: withMessage(required, t("validation.required")),
      minLength: withMessage(
        minLength(2),
        t("validation.minLength", { count: 2 }),
      ),
    },
  });

  return { r$, state };
};
