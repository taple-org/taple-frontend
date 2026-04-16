<script setup lang="ts">
import { useAuthModalController } from '~/composables/modals/useAuthModalController';

const { open } = useAuthModalController()
</script>

<template>
  <section class="hero">
    <ui-container class="hero__inner" :padding="[80, 15]">
      <div class="hero__text-content">
        <h1 class="hero__title">Находите клиентов <span class="hero__title-accent">первыми</span></h1>
        <p class="hero__subtitle">Свежие бизнес-лиды из 2ГИС, госреестров и открытых баз — автоматически, каждый день</p>
      </div>
      <div class="hero__buttons">
        <ui-button class="hero__btn" @click="open('register')">
          Начать бесплатно
        </ui-button>
        <ui-button class="hero__btn" variant="outline" @click="$router.push('/contacts')">
          Связаться с нами
        </ui-button>
      </div>
    </ui-container>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-highlight-l) 0%, var(--color-secondary) 100%);
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
