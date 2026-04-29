<script setup lang="ts">
import { DatePicker, parseDate } from "@ark-ui/vue/date-picker";
import { useI18n } from "vue-i18n";

const modelValue = defineModel<string>({ default: "" });

const props = defineProps<{
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}>();
const { t } = useI18n();

const value = computed(() => (modelValue.value ? [parseDate(modelValue.value)] : []));
const minValue = computed(() => (props.min ? parseDate(props.min) : undefined));
const maxValue = computed(() => (props.max ? parseDate(props.max) : undefined));

function handleValueChange(details: { value: Array<{ toString(): string }> }) {
  modelValue.value = details.value[0]?.toString() ?? "";
}
</script>

<template>
  <DatePicker.Root
    selection-mode="single"
    :model-value="value"
    :disabled="props.disabled"
    :min="minValue"
    :max="maxValue"
    :positioning="{ sameWidth: true }"
    lazy-mount
    unmount-on-exit
    @value-change="handleValueChange"
  >
    <DatePicker.Control class="date-picker__control">
      <DatePicker.Trigger class="date-picker__trigger">
        <DatePicker.ValueText
          class="date-picker__value"
          :placeholder="props.placeholder ?? t('common.selectDate')"
        />
        <span class="date-picker__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.667 1.333V3M11.333 1.333V3M2 5.333H14M3.333 2.333H12.667C13.403 2.333 14 2.93 14 3.667V12.667C14 13.403 13.403 14 12.667 14H3.333C2.597 14 2 13.403 2 12.667V3.667C2 2.93 2.597 2.333 3.333 2.333Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </DatePicker.Trigger>
    </DatePicker.Control>

    <Teleport to="body">
      <DatePicker.Positioner class="date-picker__positioner">
        <DatePicker.Content class="date-picker__content">
          <DatePicker.View view="day" class="date-picker__view">
            <DatePicker.Context v-slot="api">
              <DatePicker.ViewControl class="date-picker__nav">
                <DatePicker.PrevTrigger class="date-picker__nav-btn">
                  <Icon name="my-icon:arrow-left" width="14" height="14" />
                </DatePicker.PrevTrigger>
                <DatePicker.RangeText class="date-picker__range" />
                <DatePicker.NextTrigger class="date-picker__nav-btn">
                  <Icon name="my-icon:arrow-right" width="14" height="14" />
                </DatePicker.NextTrigger>
              </DatePicker.ViewControl>

              <DatePicker.Table class="date-picker__table">
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    <DatePicker.TableHeader
                      v-for="weekDay in api.weekDays"
                      :key="weekDay.short"
                      class="date-picker__header"
                    >
                      {{ weekDay.narrow }}
                    </DatePicker.TableHeader>
                  </DatePicker.TableRow>
                </DatePicker.TableHead>
                <DatePicker.TableBody>
                  <DatePicker.TableRow
                    v-for="(week, index) in api.weeks"
                    :key="index"
                  >
                    <DatePicker.TableCell
                      v-for="day in week"
                      :key="day.toString()"
                      :value="day"
                      class="date-picker__cell"
                    >
                      <DatePicker.TableCellTrigger class="date-picker__cell-trigger">
                        {{ day.day }}
                      </DatePicker.TableCellTrigger>
                    </DatePicker.TableCell>
                  </DatePicker.TableRow>
                </DatePicker.TableBody>
              </DatePicker.Table>
            </DatePicker.Context>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </Teleport>
  </DatePicker.Root>
</template>

<style scoped>
.date-picker__control {
  width: 100%;
}

.date-picker__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: 12px;
  background: var(--color-secondary);
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.date-picker__trigger[data-state="open"],
.date-picker__trigger:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.date-picker__value {
  color: var(--color-neutral-dd);
  font-size: 14px;
  text-align: left;
}

.date-picker__icon {
  display: flex;
  color: var(--color-neutral-dl);
}

.date-picker__positioner {
  z-index: 220;
}

.date-picker__content {
  width: 296px;
  max-width: calc(100vw - 24px);
  padding: 14px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: 18px;
  background: var(--color-secondary);
  box-shadow: 0 18px 42px rgba(31, 32, 36, 0.16);
  z-index: 220;
}

.date-picker__view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-picker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.date-picker__nav-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 10px;
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dd);
  cursor: pointer;
}

.date-picker__range {
  color: var(--color-neutral-dd);
  font-size: 14px;
  font-weight: 700;
}

.date-picker__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
}

.date-picker__header {
  padding-bottom: 6px;
  color: var(--color-neutral-dl);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.date-picker__cell {
  text-align: center;
}

.date-picker__cell-trigger {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.date-picker__cell-trigger[data-in-range],
.date-picker__cell-trigger[data-highlighted] {
  background: var(--color-neutral-ll);
}

.date-picker__cell-trigger[data-selected] {
  background: var(--color-primary);
  color: var(--color-secondary);
  font-weight: 700;
}

.date-picker__cell-trigger[data-disabled],
.date-picker__cell-trigger[data-unavailable] {
  background: color-mix(in srgb, var(--color-neutral-ll) 72%, transparent);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
  opacity: 0.75;
  text-decoration: line-through;
  text-decoration-thickness: 1px;
}

.date-picker__cell-trigger[data-outside-view] {
  color: var(--color-neutral-ld);
}
</style>
