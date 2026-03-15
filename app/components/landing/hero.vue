<script setup lang="ts">

defineProps<{
  title: string;
  subtitle: string;
}>();

const { open } = useAuthModal()
</script>
<template>
  <section class="hero">
    <ui-container class="hero__inner" :padding="[50, 15]">
      <div class="hero__text-content">
        <h2 class="hero__title">{{title}}</h2>
        <span class="hero__subtitle">{{subtitle}}</span>
      </div>
      <div class="hero__buttons">
        <ui-button class="register-btn" @click="open('register')">
          Зарегистрироваться
        </ui-button>
        <ui-button class="contact-btn" variant="outline" @click="$router.push('')">
          Связаться с нами
        </ui-button>
      </div>
    </ui-container>
  </section>
</template>
<style scoped>
.hero__inner{
  display: flex;
  gap: 10px;
}

.hero__text-content{
  flex-grow: 4;
}
.hero__buttons{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero__title{
  color: var(--color-primary);
  font-size: 64px;
  font-weight: bold;
}
.hero__subtitle{
  color: var(--color-neutral-dd);
  font-size: 36px;
  font-weight: 500;
}

.contact-btn , .register-btn{
  border-radius: 40px;
}

</style>
