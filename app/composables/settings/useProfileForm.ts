import type { AuthUser } from "~/types/api.types";
import { required, minLength } from "@regle/rules";

export interface IProfileFormState {
  first_name: string;
  last_name: string;
  language: string;
}

function normalizeProfile(user?: AuthUser | null): IProfileFormState {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    language: "ru",
  };
}

export const useProfileForm = (user?: Ref<AuthUser | null>) => {
  const state = reactive<IProfileFormState>({
    ...normalizeProfile(user?.value),
  });

  watch(
    user ?? ref(null),
    (value) => {
      Object.assign(state, normalizeProfile(value));
    },
    { immediate: true },
  );

  const { r$ } = useRegle(state, {
    first_name: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(2), "Минимум 2 символа"),
    },
    last_name: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(2), "Минимум 2 символа"),
    },
  });

  return { r$, state };
};
