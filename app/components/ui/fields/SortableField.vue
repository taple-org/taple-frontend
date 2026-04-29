<script lang="ts" setup generic="T extends { id: string; label: string }">
import { insert } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})

const modelValue = defineModel<T[]>({ default: () => [] })
const dragging = ref(false)
const { t } = useI18n()

function normalize(list: T[]): T[] {
  return list.map(item => ({ ...item }))
}

function same(a: T[], b: T[]) {
  return a.length === b.length && a.every((item, i) => item.id === b[i]?.id)
}


const [itemsRef, items] = useDragAndDrop<T>(toValue(modelValue), {
  group: 'sortableList',
  get disabled() {
    return props.disabled
  },
  plugins: [
    insert({
      insertPoint: () => {
        const el = document.createElement('div')
        el.classList.add('insert-indicator')
        return el
      },
    }),
  ],
  onDragstart() {
    dragging.value = true
  },
  onDragend() {
    dragging.value = false
  },

})

watch(
  () => modelValue.value,
  (next) => {
    if (!same(next, items.value)) {
      items.value = normalize(next)
    }
  },
  { deep: true }
)

watch(
  items,
  (next) => {
    const plain = normalize(next)
    if (!same(plain, modelValue.value)) {
      modelValue.value = plain
    }
  },
  { deep: true }
)
</script>

<template>
  <div ref="itemsRef" class="sortable-list" :class="{ 'sortable-list--dragging': dragging }">
    <div v-for="(item, index) in items" :key="item.id" :data-id="item.id" class="sortable-item"
      :aria-label="t('workspaceCreate.sortablePosition', { label: item.label, position: index + 1 })">
      <slot name="item" :item="item" :index="index" :dragging="dragging">
        <span class="sortable-item__handle" aria-hidden="true">⋮⋮</span>
        <span class="sortable-item__label">{{ item.label }}</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.sortable-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-block: 10px;
}

.sortable-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--color-highlight-l);
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: grab;
  user-select: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.sortable-item:hover {
  transform: translateY(-1px);
  border-color: rgba(7, 54, 130, 0.12);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.sortable-item:active {
  cursor: grabbing;
  transform: scale(0.995);
}

.sortable-item__handle {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 16px;
  line-height: 1;
}

.sortable-item__label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

:global(.insert-indicator) {
  position: absolute;
  left: 12px;
  right: 12px;
  height: 2px;
  border-radius: 9999px;
  background: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  pointer-events: none;
  z-index: 1000;
}

:global(.insert-indicator)::before {
  content: "Insert";
  position: absolute;
  top: -20px;
  left: 50%;
  padding: 1px 0px;
  border-radius: 9999px;
  background: #3b82f6;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}
</style>
