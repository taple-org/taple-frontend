<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const searchModel = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<template>
  <label class="leads-search" aria-label="Поиск лидов">
    <Icon name="my-icon-search" mode="svg" :size="16" />
    <input
      v-model="searchModel"
      type="search"
      class="leads-search__input"
      placeholder="Поиск по названию / адресу / телефону"
    />
  </label>
</template>

<style scoped>
.leads-search {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 44px;
  padding: 0 16px;
  border-radius: 24px;
  background: var(--color-neutral-ll);
  color: #2f3036;
}

.leads-search__input {
  width: 100%;
  border: 0;
  background: transparent;
  outline: none;
  color: var(--color-neutral-dd);
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.leads-search__input::placeholder {
  color: var(--color-neutral-dl);
}

@media (max-width: 700px) {
  .leads-search {
    gap: 10px;
  }

  .leads-search__input {
    font-size: 12px;
  }
}
</style>
