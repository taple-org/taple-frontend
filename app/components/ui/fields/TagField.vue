<script lang="ts" setup>
import type { Tag } from '~/interfaces/workspace.interfaces';

const props = defineProps<{
  label: string
  availableTags: Tag[]
}>()

const modelValue = defineModel<Tag[]>({ default: () => [] })

const search = ref('')
const isAdding = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const filteredTags = computed(() => {
  const selectedIds = new Set(modelValue.value.map(t => t.id))
  return props.availableTags.filter(
    t => !selectedIds.has(t.id) &&
      t.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

function startAdding() {
  isAdding.value = true
  nextTick(() => inputRef.value?.focus())
}

function stopAdding() {
  setTimeout(() => {
    isAdding.value = false
    search.value = ''
  }, 150)
}

function addTag(tag: Tag) {
  modelValue.value = [...modelValue.value, tag]
  search.value = ''
  nextTick(() => inputRef.value?.focus())
}

function removeTag(tagId: string) {
  modelValue.value = modelValue.value.filter(t => t.id !== tagId)
}
</script>

<template>
  <div class="tag-field">
    <div class="tag-field__header">{{ label }}</div>

    <div class="tag-field__chips">
      <div v-for="tag in modelValue" :key="tag.id" class="tag-chip">
        <span class="tag-chip__label">{{ tag.label }}</span>
        <button class="tag-chip__remove" type="button" @click="removeTag(tag.id)">
          Убрать
        </button>
      </div>

      <!-- Inline input когда добавляем -->
      <div v-if="isAdding" class="tag-chip tag-chip--input-wrap">
        <input ref="inputRef" v-model="search" class="tag-chip__input" placeholder="Тег..." @blur="stopAdding" />
      </div>

      <button v-else class="tag-field__add" type="button" @click="startAdding">
        + Добавить
      </button>
    </div>

    <Transition name="dropdown">
      <div v-if="isAdding" class="tag-field__dropdown">
        <template v-if="filteredTags.length">
          <button v-for="tag in filteredTags" :key="tag.id" type="button" class="tag-field__dropdown-item"
            @mousedown.prevent="addTag(tag)">
            {{ tag.label }}
          </button>
        </template>
        <div v-else class="tag-field__dropdown-empty">
          Ничего не найдено
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tag-field {
  position: relative;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: 16px;
  background-color: var(--color-neutral-ll);

  font-family: var(--font-base);
  font-style: normal;
  line-height: normal;
}

.tag-field__header {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.tag-field__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 28px;
}

.tag-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  min-width: 50px;
  border-radius: 12px;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  overflow: hidden;
}

.tag-chip__label {
  margin: 0 auto;
  pointer-events: none;
}

.tag-chip__remove {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-error);
  color: var(--color-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.tag-chip:hover .tag-chip__remove {
  opacity: 1;
}

.tag-chip--input-wrap {
  background-color: var(--color-highlight-l);
  padding: 0;
  min-width: 80px;
}

.tag-chip__input {
  padding: 6px 10px;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-primary);
}

.tag-chip__input::placeholder {
  color: var(--color-primary);
  opacity: 0.5;
}

.tag-field__add {
  display: inline-flex;
  padding: 6px 10px;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 12px;
  background-color: var(--color-highlight-l);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.tag-field__add:hover {
  background-color: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.tag-field__dropdown {
  z-index: 100;
  top: 80px;
  left: 0;
  position: absolute;
  display: flex;
  width: 95%;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-neutral-dd) 10%, transparent);
}

.tag-field__dropdown-item {
  display: flex;
  padding: 5px 12px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--color-neutral-dl, #71727a);
  font-size: 10px;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-base), color var(--transition-base), font-weight var(--transition-base);
}

.tag-field__dropdown-item:hover {
  background: var(--color-neutral-ll, #f8f9fe);
  color: var(--color-neutral-dd, #1f2024);
  font-weight: 500;
}

.tag-field__dropdown-empty {
  padding: 5px 12px;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-neutral-dl);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>