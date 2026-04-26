<script setup lang="ts">
import { useAuthModalController } from "~/composables/modals/useAuthModalController";
import { useI18n } from "vue-i18n";

const { open } = useAuthModalController();
const { t } = useI18n();
</script>

<template>
  <section class="hero">
    <ui-container class="hero__inner" :padding="[80, 15]">
      <div class="hero__text-content">
        <h1 class="hero__title">
          {{ t("landing.heroTitle") }}
          <span class="hero__title-accent">{{
            t("landing.heroTitleAccent")
          }}</span>
        </h1>
        <p class="hero__subtitle">{{ t("landing.heroSubtitle") }}</p>
      </div>
      <div class="hero__buttons">
        <ui-button class="hero__btn" @click="open('register')">
          {{ t("landing.startFree") }}
        </ui-button>
        <ui-button
          class="hero__btn"
          variant="outline"
          @click="$router.push('/contacts')"
        >
          {{ t("landing.contactUs") }}
        </ui-button>
      </div>
    </ui-container>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(
    135deg,
    var(--color-highlight-l) 0%,
    var(--color-secondary) 100%
  );
  border-bottom: 1px solid var(--color-neutral-lm);
}

.hero__inner {
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero__text-content {
  flex: 1;
}

.hero__title {
  color: var(--color-neutral-dd);
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero__title-accent {
  color: var(--color-primary);
}

.hero__subtitle {
  color: var(--color-neutral-dm);
  font-size: 22px;
  font-weight: 400;
  line-height: 1.5;
  max-width: 560px;
}

.hero__buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.hero__btn {
  border-radius: 40px;
  min-width: 200px;
}

@media (max-width: 900px) {
  .hero__inner {
    flex-direction: column;
    gap: 40px;
  }
  .hero__title {
    font-size: 44px;
  }
  .hero__buttons {
    flex-direction: row;
    width: 100%;
  }
  .hero__btn {
    flex: 1;
  }
}
</style>
