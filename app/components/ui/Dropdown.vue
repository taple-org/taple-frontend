<script lang="ts" setup>
import { Select, createListCollection } from "@ark-ui/vue/select";
export type DropdownOption = {
  label: string;
  value: string;
};

const props = withDefaults(
  defineProps<{
    options: DropdownOption[];
    placeholder?: string;
    name?: string;
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {
    placeholder: "Город",
    name: undefined,
    disabled: false,
    invalid: false,
  },
);

const model = defineModel<string | null>({ default: null });

const collection = computed(() =>
  createListCollection({ items: props.options }),
);

const selectedValue = computed<string[]>({
  get() {
    return model.value ? [model.value] : [];
  },
  set(value) {
    model.value = value[0] ?? null;
  },
});
</script>

<template>
  <Select.Root
    v-model="selectedValue"
    :collection="collection"
    :name="props.name"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :positioning="{
      sameWidth: true,
      placement: 'bottom-start',
      offset: { mainAxis: 8 },
    }"
    class="dropdown"
  >
    <Select.Trigger class="dropdown__trigger">
      <Select.Control class="dropdown__control">
        <Select.ValueText
          :class="[
            'dropdown__value',
            { 'dropdown__value--selected': selectedValue.length > 0 },
          ]"
          :placeholder="props.placeholder"
        />

        <Select.Indicator class="dropdown__indicator" aria-hidden="true">
          <Icon name="other-arrow-down" mode="svg" :size="16" />
        </Select.Indicator>
      </Select.Control>
    </Select.Trigger>

    <Teleport to="body">
      <Select.Positioner>
        <Select.Content class="dropdown__content">
          <Select.Item
            v-for="item in props.options"
            :key="item.value"
            :item="item"
            class="dropdown__item"
          >
            <Select.ItemText class="dropdown__item-text">
              {{ item.label }}
            </Select.ItemText>
          </Select.Item>
        </Select.Content>
      </Select.Positioner>
    </Teleport>

    <Select.HiddenSelect />
  </Select.Root>
</template>

<style scoped>
.dropdown {
  width: 100%;
}

.dropdown__control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: 10px 16px;
  border-radius: 12px;
  background-color: var(--color-neutral-lm);
  transition:
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

.dropdown__trigger {
  width: 50%;
  flex: 1;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.dropdown__value {
  font-family: var(--font-base);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--color-neutral-dl);
}

.dropdown__value--selected {
  color: var(--color-neutral-dd);
}

.dropdown__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-neutral-dl);
  pointer-events: none;

  /* Ensure a fallback timing if your variable is missing */
  transition: transform 0.25s ease-in-out;
}

/* 2. Target both possible attribute patterns Ark UI uses */
.dropdown__indicator[data-state="open"],
.dropdown[data-open] .dropdown__indicator {
  transform: rotate(180deg);
}
.dropdown[data-focus-visible] .dropdown__control,
.dropdown[data-open] .dropdown__control {
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--color-highlight-d) 20%, transparent);
}

.dropdown[data-disabled] .dropdown__control {
  opacity: 0.65;
  cursor: not-allowed;
}

.dropdown[data-invalid] .dropdown__control {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 18%, transparent);
}

.dropdown__content {
  overflow: hidden;
  background: var(--color-neutral-ll);
  border: 1px solid var(--color-neutral-lm);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 20px rgb(31 32 36 / 12%);
  z-index: 1000;
}

.dropdown__item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.dropdown__item[data-highlighted] {
  background: #f8f9fe;
}

.dropdown__item[data-state="checked"] {
  background: #f8f9fe;
}

.dropdown__item-text {
  font-family: var(--font-base);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--color-neutral-dm);
}
</style>
