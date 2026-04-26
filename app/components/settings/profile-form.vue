<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ $t("profile.personalInfo") }}</h2>
      <p class="card-desc">{{ $t("profile.personalInfoDesc") }}</p>
    </div>

    <form class="form-grid" @submit.prevent="handleSubmit">
      <ui-form-field
        type="text"
        v-model="r$.$value.first_name"
        :error="r$.first_name.$errors[0]"
        :label="$t('profile.firstName')"
        :placeholder="$t('profile.firstNamePlaceholder')"
      />
      <ui-form-field
        type="text"
        v-model="r$.$value.last_name"
        :error="r$.last_name.$errors[0]"
        :label="$t('profile.lastName')"
        :placeholder="$t('profile.lastNamePlaceholder')"
      />

      <ui-form-field
        class="form__lang"
        type="select"
        v-model="r$.$value.language"
        :label="$t('profile.language')"
        :placeholder="$t('profile.languagePlaceholder')"
        :options="languageOptions"
      />

      <div class="form-footer">
        <ui-button variant="outline" type="button" @click="r$.$reset()">
          {{ $t("profile.cancel") }}
        </ui-button>
        <ui-button type="submit" variant="primary" :disabled="isLoading">
          {{ isLoading ? $t("profile.saving") : $t("profile.saveChanges") }}
        </ui-button>
      </div>
    </form>

    <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { useProfileForm } from "~/composables/settings/useProfileForm";
import { useAuthStore } from "~/stores/auth.store";

const { t, setLocale } = useI18n();
const authStore = useAuthStore();
const { r$, state } = useProfileForm(computed(() => authStore.user));

const isLoading = ref(false);
const successMessage = ref("");

const languageOptions = computed(() => [
  { label: t("languages.ru"), value: "ru" },
  { label: t("languages.en"), value: "en" },
  { label: t("languages.kk"), value: "kk" },
]);

async function handleSubmit() {
  const result = await r$.$validate();
  if (!result.valid) return;

  isLoading.value = true;
  successMessage.value = "";
  try {
    // Update user data
    Object.assign(authStore.user ?? {}, {
      first_name: state.first_name,
      last_name: state.last_name,
      language: state.language,
    });

    // Apply locale change immediately
    if (state.language && ["en", "ru", "kk"].includes(state.language)) {
      await setLocale(state.language as "en" | "ru" | "kk");
      if (import.meta.client) {
        localStorage.setItem("i18n_locale", state.language);
        useCookie("i18n_locale", { maxAge: 60 * 60 * 24 * 365 }).value =
          state.language;
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    successMessage.value = t("profile.updated");
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form__lang {
  grid-column: 1 / -1;
}

.form-footer {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.success-banner {
  margin-top: 14px;
  padding: 10px 14px;
  background: var(--color-success-l);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form__lang {
    grid-column: 1;
  }
}
</style>
