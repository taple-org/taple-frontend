<script setup lang="ts">
import type { TenantLeadListItem } from "~/api/generated/api";
import { getLeadStageLabel } from "~/stores/leads.store";
import { getLocalizedField } from "~/utils/localized";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const props = defineProps<{
  leads: TenantLeadListItem[];
  selectedIds: Set<string>;
  isLoading: boolean;
  hasMore: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  selectAll: [];
  clearSelection: [];
  showDetail: [id: string];
  showMore: [];
}>();

const allSelected = computed(
  () =>
    props.leads.length > 0 &&
    props.leads.every((l) => props.selectedIds.has(l.id)),
);

const toggleAll = () => {
  if (allSelected.value) {
    emit("clearSelection");
  } else {
    emit("selectAll");
  }
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatScore = (score: number | null | undefined) =>
  score != null ? Math.round(score * 100) : "—";

const stageColor = (stage: string) => {
  const colors: Record<string, string> = {
    new: "#006FFD",
    in_progress: "#298267",
    first_contact: "#FF8C00",
    negotiation: "#9B59B6",
    contract: "#27AE60",
    monitoring: "#00B5D8",
    won: "#2ECC71",
    lost: "#E74C3C",
    snoozed: "#95A5A6",
    hidden: "#BDC3C7",
  };
  return colors[stage] ?? "#71727A";
};

const getCityLabel = (lead: TenantLeadListItem) =>
  getLocalizedField(lead as unknown as LocalizedRecord, "address_city_name", locale.value);

const getCategoryLabel = (lead: TenantLeadListItem) =>
  getLocalizedField(lead as unknown as LocalizedRecord, "lead_business_category_name", locale.value);
</script>

<template>
  <div class="leads-table-wrapper">
    <div v-if="isLoading" class="leads-table__loading">
      <div class="leads-table__spinner" />
      <span>{{ t("leads.loading") }}</span>
    </div>

    <div v-else-if="leads.length === 0" class="leads-table__empty">
      <Icon name="my-icon-inbox" mode="svg" :size="32" />
      <p>{{ t("leads.notFound") }}</p>
      <span>{{ t("leads.tryChangeFilters") }}</span>
    </div>

    <table v-else class="leads-table">
      <thead class="leads-table__head">
        <tr>
          <th class="leads-table__th leads-table__th--check">
            <input
              type="checkbox"
              class="leads-table__checkbox"
              :checked="allSelected"
              :indeterminate="selectedIds.size > 0 && !allSelected"
              @change="toggleAll"
            />
          </th>
          <th class="leads-table__th">{{ t("leads.table.name") }}</th>
          <th class="leads-table__th leads-table__th--hide-sm">
            {{ t("leads.table.category") }}
          </th>
          <th class="leads-table__th leads-table__th--hide-md">
            {{ t("leads.table.city") }}
          </th>
          <th class="leads-table__th">{{ t("leads.table.stage") }}</th>
          <th class="leads-table__th leads-table__th--hide-sm">
            {{ t("leads.table.priority") }}
          </th>
          <th class="leads-table__th leads-table__th--hide-md">
            {{ t("leads.table.fit") }}
          </th>
          <th class="leads-table__th leads-table__th--hide-lg">
            {{ t("leads.table.date") }}
          </th>
          <th class="leads-table__th leads-table__th--actions" />
        </tr>
      </thead>

      <tbody class="leads-table__body">
        <tr
          v-for="lead in leads"
          :key="lead.id"
          class="leads-table__row"
          :class="{ 'leads-table__row--selected': selectedIds.has(lead.id) }"
          @click.stop="emit('showDetail', lead.id)"
        >
          <td class="leads-table__td leads-table__td--check" @click.stop>
            <input
              type="checkbox"
              class="leads-table__checkbox"
              :checked="selectedIds.has(lead.id)"
              @change="emit('select', lead.id)"
            />
          </td>

          <td class="leads-table__td">
            <div class="leads-table__name">
              <span class="leads-table__title">{{ lead.lead_name }}</span>
              <span
                v-if="getCityLabel(lead)"
                class="leads-table__city-inline leads-table__city-inline--hide-md"
              >
                {{ getCityLabel(lead) }}
              </span>
            </div>
          </td>

          <td class="leads-table__td leads-table__td--hide-sm">
            <span class="leads-table__category">
              {{ getCategoryLabel(lead) || "—" }}
            </span>
          </td>

          <td class="leads-table__td leads-table__td--hide-md">
            <span class="leads-table__text">
              {{ getCityLabel(lead) || "—" }}
            </span>
          </td>

          <td class="leads-table__td">
            <span
              class="leads-table__stage"
              :style="{
                color: stageColor(lead.stage_code),
                borderColor: stageColor(lead.stage_code) + '33',
              }"
            >
              {{ getLeadStageLabel(lead.stage_code, t) }}
            </span>
          </td>

          <td class="leads-table__td leads-table__td--hide-sm">
            <div class="leads-table__score">
              <div
                class="leads-table__score-bar"
                :style="{ width: `${formatScore(lead.priority_score)}%` }"
              />
              <span class="leads-table__score-val">{{
                formatScore(lead.priority_score)
              }}</span>
            </div>
          </td>

          <td class="leads-table__td leads-table__td--hide-md">
            <span class="leads-table__text">{{
              formatScore(lead.fit_score)
            }}</span>
          </td>

          <td class="leads-table__td leads-table__td--hide-lg">
            <span class="leads-table__date">{{
              formatDate(lead.created_at)
            }}</span>
          </td>

          <td class="leads-table__td leads-table__td--actions" @click.stop>
            <slot name="actions" :lead="lead" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="hasMore && leads.length > 0" class="leads-table__footer">
      <button class="leads-table__show-more" @click="emit('showMore')">
        {{ t("common.showMore") }}
        <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.leads-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  background: var(--color-neutral-ll);
}

.leads-table__loading,
.leads-table__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px 20px;
  color: var(--color-neutral-dl);
  text-align: center;
}

.leads-table__loading {
  flex-direction: row;
  gap: 12px;
}

.leads-table__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-neutral-ld);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.leads-table__empty p {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-neutral-dm);
}

.leads-table__empty span {
  font-size: 12px;
  font-weight: 400;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.leads-table__head {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--color-neutral-ll);
}

.leads-table__th {
  padding: 12px 8px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-neutral-dm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-neutral-ld);
  white-space: nowrap;
}

.leads-table__th--check {
  width: 36px;
  padding-left: 16px;
}

.leads-table__th--actions {
  width: 40px;
}

.leads-table__checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.leads-table__row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.leads-table__row:hover {
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.leads-table__row--selected {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.leads-table__td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-neutral-ld);
  vertical-align: middle;
}

.leads-table__td--check {
  padding-left: 16px;
}

.leads-table__td--actions {
  padding-right: 8px;
  text-align: right;
}

.leads-table__name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.leads-table__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.leads-table__city-inline {
  font-size: 10px;
  color: var(--color-neutral-dl);
}

.leads-table__category {
  font-size: 11px;
  color: var(--color-neutral-dl);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 160px;
}

.leads-table__text {
  font-size: 12px;
  color: var(--color-neutral-dm);
}

.leads-table__date {
  font-size: 11px;
  color: var(--color-neutral-dl);
  white-space: nowrap;
}

.leads-table__stage {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.leads-table__score {
  display: flex;
  align-items: center;
  gap: 6px;
}

.leads-table__score-bar {
  flex: 1;
  height: 4px;
  background: var(--color-primary);
  border-radius: 2px;
  max-width: 60px;
  min-width: 0;
}

.leads-table__score-val {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  min-width: 20px;
  text-align: right;
}

.leads-table__footer {
  padding: 12px;
  text-align: center;
  border-top: 1px solid var(--color-neutral-ld);
}

.leads-table__show-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  padding: 6px 10px;
  background: transparent;
  color: var(--color-neutral-dm);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 1280px) {
  .leads-table__th--hide-lg,
  .leads-table__td--hide-lg {
    display: none;
  }
}

@media (max-width: 980px) {
  .leads-table__th--hide-md,
  .leads-table__td--hide-md {
    display: none;
  }

  .leads-table__city-inline--hide-md {
    display: inline;
  }
}

@media (max-width: 700px) {
  .leads-table__th--hide-sm,
  .leads-table__td--hide-sm {
    display: none;
  }
}
</style>
