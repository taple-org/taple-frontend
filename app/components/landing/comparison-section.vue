<template>
  <section class="comparison-section">
    <ui-container :padding="[80, 15]">
      <div class="section-header">
        <h2 class="section-title">{{ t("landing.comparisonTitle") }}</h2>
        <p class="section-subtitle">{{ t("landing.comparisonSubtitle") }}</p>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="col-criteria">
                {{ t("landing.comparisonCriteria") }}
              </th>
              <th class="col-taple">Taple</th>
              <th class="col-manual">{{ t("landing.comparisonManual") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.criteria">
              <td class="col-criteria">{{ row.criteria }}</td>
              <td class="col-taple">
                <span class="badge badge--yes">
                  <Icon name="my-icon:check" class="badge__icon" />
                  {{ row.taple }}
                </span>
              </td>
              <td class="col-manual">
                <span class="badge badge--no">
                  <Icon name="my-icon:close" class="badge__icon" />
                  {{ row.manual }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ui-container>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rows = computed(() => [
  {
    criteria: t("landing.criteriaDataSources"),
    taple: t("landing.tapleDataSources"),
    manual: t("landing.manualDataSources"),
  },
  {
    criteria: t("landing.criteriaUpdateFreq"),
    taple: t("landing.tapleUpdateFreq"),
    manual: t("landing.manualUpdateFreq"),
  },
  {
    criteria: t("landing.criteriaDeduplication"),
    taple: t("landing.tapleDeduplication"),
    manual: t("landing.manualDeduplication"),
  },
  {
    criteria: t("landing.criteriaExport"),
    taple: t("landing.tapleExport"),
    manual: t("landing.manualExport"),
  },
  {
    criteria: t("landing.criteriaTeamwork"),
    taple: t("landing.tapleTeamwork"),
    manual: t("landing.manualTeamwork"),
  },
]);
</script>

<style scoped>
.comparison-section {
  background: var(--color-neutral-ll);
}

.section-header {
  text-align: center;
  margin-bottom: 52px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--color-neutral-dm);
}

.comparison-table-wrap {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.comparison-table th {
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-neutral-dl);
  border-bottom: 2px solid var(--color-neutral-lm);
  text-align: left;
}

.comparison-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-neutral-ll);
  vertical-align: middle;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.col-criteria {
  width: 22%;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dd);
}

.col-taple {
  width: 39%;
}
.col-manual {
  width: 39%;
}

th.col-taple {
  color: var(--color-primary);
}
th.col-manual {
  color: var(--color-neutral-dl);
}

.badge {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.badge__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.badge--yes {
  color: var(--color-neutral-dd);
}
.badge--yes .badge__icon {
  color: var(--color-success);
}

.badge--no {
  color: var(--color-neutral-dl);
}
.badge--no .badge__icon {
  color: var(--color-error);
}
</style>
