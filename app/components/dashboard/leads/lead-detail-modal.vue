<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "@ark-ui/vue/dialog";
import type { Lead } from "./types";
import UiButton from "~/components/ui/Button.vue";
import UiBadge from "~/components/ui/Badge.vue";
import UiContentSwitcher from "~/components/ui/ContentSwitcher.vue";
import type { ContentSwitcherItem } from "~/components/ui/ContentSwitcher.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineOptions({ inheritAttrs: false });

interface Props {
  lead: Lead | null;
}

interface Emits {
  "update:open": [value: boolean];
  postpone: [leadId: string];
  take: [leadId: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = defineModel<boolean>("open");

const tabs = computed<ContentSwitcherItem[]>(() => [
  { value: "info", label: t("lead.tabs.info") },
  { value: "eval", label: t("lead.tabs.eval") },
  { value: "history", label: t("lead.tabs.history") },
]);

const selectedTab = ref<string[]>(["info"]);
const noteValue = ref<string>("");
const expandedBranchId = ref<string | null>(null);

const handlePostpone = () => {
  if (props.lead?.id) {
    emit("postpone", props.lead.id);
  }
};

const handleTake = () => {
  if (props.lead?.id) {
    emit("take", props.lead.id);
  }
};

// Score bars config
const scoreEntries = computed(() => {
  if (!props.lead) return [];
  return [
    {
      label: t("lead.score.fit"),
      value: props.lead.fitScore ?? 0,
      color: "#298267",
    },
    {
      label: t("lead.score.priority"),
      value: props.lead.priorityScore ?? 0,
      color: "#006FFD",
    },
    {
      label: t("lead.score.freshness"),
      value: props.lead.freshnessScore ?? 0,
      color: "#F4B400",
    },
    {
      label: t("lead.score.contactability"),
      value: props.lead.contactabilityScore ?? 0,
      color: "#7B1FA2",
    },
    {
      label: t("lead.score.potential"),
      value: props.lead.businessPotentialScore ?? 0,
      color: "#E65100",
    },
  ].filter((s) => s.value > 0);
});

// Tax payments — group by year, sum all types
const taxByYear = computed(() => {
  if (!props.lead?.taxPayments) return [];
  const map: Record<number, number> = {};
  for (const entry of props.lead.taxPayments) {
    const total = entry.items.reduce((s: number, i: any) => s + i.amount, 0);
    map[entry.year] = (map[entry.year] ?? 0) + total;
  }
  return Object.entries(map)
    .map(([year, total]) => ({ year: Number(year), total }))
    .sort((a, b) => a.year - b.year);
});

const maxTax = computed(() =>
  taxByYear.value.reduce((m, e) => Math.max(m, e.total), 0),
);

const formatTax = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}К`;
  return String(Math.round(n));
};

const toggleBranch = (id: string) => {
  expandedBranchId.value = expandedBranchId.value === id ? null : id;
};

// Branches with congestion
const branchesWithCongestion = computed(
  () => props.lead?.branches?.filter((b: any) => b.congestion?.present) ?? [],
);
</script>

<template>
  <div>
    <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit>
      <Teleport to="body">
        <Dialog.Backdrop class="modal-backdrop" />
        <Dialog.Positioner class="modal-positioner">
          <Dialog.Content v-if="lead" class="modal">
            <!-- Header -->
            <div class="modal__header">
              <div class="modal__header-top">
                <div class="modal__badges">
                  <UiBadge variant="primary" size="sm">{{
                    lead.openStatus
                  }}</UiBadge>
                  <div class="modal__score">{{ lead.score }}</div>
                  <!-- Signals badges -->
                  <span
                    v-if="lead.signals?.hasDelivery"
                    class="modal__signal-badge modal__signal-badge--delivery"
                  >
                    {{ t("lead.delivery") }}
                  </span>
                  <span
                    v-if="lead.signals?.is24x7"
                    class="modal__signal-badge modal__signal-badge--247"
                  >
                    {{ t("lead.247") }}
                  </span>
                </div>
                <div class="modal__header-right">
                  <div v-if="lead.signals?.rating" class="modal__rating">
                    <span class="modal__rating-star">★</span>
                    <span class="modal__rating-val">{{
                      lead.signals.rating
                    }}</span>
                    <span
                      v-if="lead.signals.reviewCount"
                      class="modal__rating-count"
                    >
                      ({{ lead.signals.reviewCount.toLocaleString() }})
                    </span>
                  </div>
                  <Dialog.CloseTrigger class="modal__close">
                    <Icon name="other-icon-close" mode="svg" :size="10" />
                  </Dialog.CloseTrigger>
                </div>
              </div>

              <div class="modal__title-section">
                <h2 class="modal__title">{{ lead.title }}</h2>
                <p class="modal__subtitle">{{ lead.subtitle }}</p>
              </div>

              <div v-if="lead.tags.length" class="modal__tags">
                <span v-for="tag in lead.tags" :key="tag" class="modal__tag">{{
                  tag
                }}</span>
              </div>
            </div>

            <!-- Tabs -->
            <UiContentSwitcher
              v-model="selectedTab"
              :items="tabs"
              class="modal__tabs"
            />

            <!-- Tab Content -->
            <div class="modal__content">
              <!-- Info Tab -->
              <div v-if="selectedTab[0] === 'info'" class="modal__tab-panel">
                <div class="modal__columns">
                  <div class="modal__column">
                    <div
                      v-if="lead.contacts.length || lead.email"
                      class="modal__section"
                    >
                      <h3 class="modal__section-title">
                        {{ t("lead.contacts") }}
                      </h3>
                      <div class="modal__section-content">
                        <div
                          v-for="contact in lead.contacts"
                          :key="contact"
                          class="modal__contact-row"
                        >
                          <Icon name="other-icon-phone" mode="svg" :size="14" />
                          <span>{{ contact }}</span>
                        </div>
                        <div v-if="lead.email" class="modal__contact-row">
                          <Icon name="my-icon-inbox" mode="svg" :size="14" />
                          <span>{{ lead.email }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="lead.address" class="modal__section">
                      <div class="modal__section-header">
                        <h3 class="modal__section-title">
                          {{ t("lead.location") }}
                        </h3>
                        <a href="#" class="modal__link" @click.prevent>
                          {{ t("lead.openIn2GIS") }}
                          <Icon
                            name="other-icon-external"
                            mode="svg"
                            :size="8"
                          />
                        </a>
                      </div>
                      <div class="modal__section-content">
                        <p class="modal__text">{{ lead.address }}</p>
                        <div
                          v-if="lead.signals"
                          class="modal__location-signals"
                        >
                          <span
                            v-if="lead.signals.nearestStationDistance"
                            class="modal__loc-chip"
                          >
                            🚇 {{ lead.signals.nearestStationDistance }}м
                          </span>
                          <span
                            v-if="lead.signals.nearestParkingCount"
                            class="modal__loc-chip"
                          >
                            🅿️ {{ lead.signals.nearestParkingCount }}
                            {{ t("lead.parking") }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-if="lead.freshness" class="modal__section">
                      <h3 class="modal__section-title">
                        {{ t("lead.freshness") }}
                      </h3>
                      <div class="modal__section-content">
                        <p class="modal__text">{{ lead.freshness }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="modal__column">
                    <div
                      v-if="lead.reasons.length"
                      class="modal__section modal__section--full"
                    >
                      <h3 class="modal__section-title">
                        {{ t("lead.summary") }}
                      </h3>
                      <div class="modal__section-content modal__summary">
                        <div
                          v-for="(reason, index) in lead.reasons"
                          :key="index"
                          class="modal__summary-row"
                        >
                          <span class="modal__summary-label"
                            >{{ reason.split(":")[0] }}:</span
                          >
                          <span class="modal__summary-value">{{
                            reason.split(":")[1]?.trim()
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal__section">
                  <h3 class="modal__section-title">{{ t("lead.note") }}</h3>
                  <div class="modal__section-content">
                    <textarea
                      v-model="noteValue"
                      class="modal__textarea"
                      :placeholder="t('lead.notePlaceholder')"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <!-- Evaluation Tab -->
              <div v-if="selectedTab[0] === 'eval'" class="modal__tab-panel">
                <!-- Score bars -->
                <div v-if="scoreEntries.length" class="modal__section">
                  <h3 class="modal__section-title">{{ t("lead.scoring") }}</h3>
                  <div class="modal__section-content">
                    <div
                      v-for="s in scoreEntries"
                      :key="s.label"
                      class="modal__score-bar-row"
                    >
                      <span class="modal__score-bar-label">{{ s.label }}</span>
                      <div class="modal__score-bar-track">
                        <div
                          class="modal__score-bar-fill"
                          :style="{
                            width: `${s.value * 100}%`,
                            background: s.color,
                          }"
                        />
                      </div>
                      <span class="modal__score-bar-val"
                        >{{ Math.round(s.value * 100) }}%</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Fit Scores (legacy) -->
                <div v-if="lead.fitScores.length" class="modal__section">
                  <h3 class="modal__section-title">
                    {{ t("lead.productScores") }}
                  </h3>
                  <div class="modal__section-content">
                    <div
                      v-for="score in lead.fitScores"
                      :key="score.label"
                      class="modal__score-row"
                    >
                      <span class="modal__score-label">{{ score.label }}</span>
                      <span class="modal__score-value">{{ score.level }}</span>
                    </div>
                  </div>
                </div>

                <!-- Tax payments chart -->
                <div v-if="taxByYear.length" class="modal__section">
                  <h3 class="modal__section-title">
                    {{ t("lead.taxPayments") }}
                  </h3>
                  <div class="modal__tax-chart">
                    <div
                      v-for="entry in taxByYear"
                      :key="entry.year"
                      class="modal__tax-bar-col"
                    >
                      <span class="modal__tax-bar-val">{{
                        formatTax(entry.total)
                      }}</span>
                      <div class="modal__tax-bar-track">
                        <div
                          class="modal__tax-bar-fill"
                          :style="{
                            height: `${maxTax > 0 ? (entry.total / maxTax) * 100 : 0}%`,
                          }"
                        />
                      </div>
                      <span class="modal__tax-bar-year">{{ entry.year }}</span>
                    </div>
                  </div>
                </div>

                <!-- KGD SUR -->
                <div v-if="lead.kgdSur?.vatRegistered" class="modal__section">
                  <h3 class="modal__section-title">{{ t("lead.taxMode") }}</h3>
                  <div class="modal__section-content">
                    <p class="modal__text">{{ lead.kgdSur.taxMode }}</p>
                    <div
                      class="modal__kgd-row"
                      v-if="
                        lead.kgdSur.taxDebt !== null &&
                        lead.kgdSur.taxDebt !== undefined
                      "
                    >
                      <span class="modal__kgd-label"
                        >{{ t("lead.taxDebt") }}:</span
                      >
                      <span
                        class="modal__kgd-value"
                        :class="
                          lead.kgdSur.taxDebt < 0
                            ? 'modal__kgd-value--debt'
                            : 'modal__kgd-value--ok'
                        "
                      >
                        {{
                          lead.kgdSur.taxDebt < 0
                            ? `${Math.abs(lead.kgdSur.taxDebt).toLocaleString()} ₸`
                            : t("lead.noDebt")
                        }}
                      </span>
                    </div>
                    <div
                      class="modal__kgd-row"
                      v-if="lead.kgdSur.vatRegistered !== null"
                    >
                      <span class="modal__kgd-label">{{ t("lead.vat") }}:</span>
                      <span class="modal__kgd-value">{{
                        lead.kgdSur.vatRegistered
                          ? t("lead.vatRegistered")
                          : t("lead.vatNotRegistered")
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Branches -->
                <div v-if="lead.branches.length" class="modal__section">
                  <h3 class="modal__section-title">
                    {{ t("lead.branches") }} ({{ lead.branches.length }})
                  </h3>
                  <div class="modal__section-content">
                    <div
                      v-for="branch in lead.branches"
                      :key="branch.id"
                      class="modal__branch"
                    >
                      <div
                        class="modal__branch-header"
                        :class="{
                          'modal__branch-header--clickable':
                            branch.congestion?.present,
                        }"
                        @click="
                          branch.congestion?.present
                            ? toggleBranch(branch.id)
                            : undefined
                        "
                      >
                        <span class="modal__branch-name">{{
                          branch.name || t("lead.unnamed")
                        }}</span>
                        <div class="modal__branch-right">
                          <span
                            :class="[
                              'modal__branch-status',
                              branch.isActive
                                ? 'modal__branch-status--active'
                                : 'modal__branch-status--inactive',
                            ]"
                          >
                            {{
                              branch.isActive
                                ? t("lead.active")
                                : t("lead.inactive")
                            }}
                          </span>
                          <span
                            v-if="branch.congestion?.present"
                            class="modal__branch-cong-icon"
                          >
                            {{ expandedBranchId === branch.id ? "▲" : "▼" }}
                            📊
                          </span>
                        </div>
                      </div>

                      <p
                        v-if="branch.fullAddress"
                        class="modal__branch-address"
                      >
                        {{ branch.fullAddress }}
                      </p>

                      <div
                        v-if="
                          branch.rating != null || branch.reviewCount != null
                        "
                        class="modal__branch-signals"
                      >
                        <span
                          v-if="branch.rating != null"
                          class="modal__branch-signal"
                          >⭐ {{ branch.rating }}</span
                        >
                        <span
                          v-if="branch.reviewCount != null"
                          class="modal__branch-signal"
                          >💬 {{ branch.reviewCount }}</span
                        >
                      </div>

                      <!-- Congestion heatmap (expandable) -->
                      <Transition name="cong-expand">
                        <div
                          v-if="
                            branch.congestion?.present &&
                            expandedBranchId === branch.id
                          "
                          class="modal__branch-heatmap"
                        >
                          <dashboard-leads-congestion-heatmap
                            :congestion="branch.congestion"
                          />
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </div>

              <!-- History Tab -->
              <div v-if="selectedTab[0] === 'history'" class="modal__tab-panel">
                <div class="modal__empty">
                  <p>{{ t("lead.historyEmpty") }}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal__footer">
              <UiButton
                variant="error"
                class="modal__btn"
                @click="handlePostpone"
              >
                {{ t("lead.postpone") }}
              </UiButton>
              <UiButton
                variant="primary"
                class="modal__btn"
                @click="handleTake"
              >
                {{ t("lead.take") }}
              </UiButton>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Teleport>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
.modal-backdrop[data-state="open"] {
  animation: fadeIn 200ms ease;
}
.modal-backdrop[data-state="closed"] {
  animation: fadeOut 150ms ease;
}

.modal-positioner {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
  pointer-events: none;
}

.modal {
  width: 90%;
  max-width: 690px;
  max-height: 90vh;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e8e9f1;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  pointer-events: all;
  contain: layout style;
}
.modal[data-state="open"] {
  animation: slideUp 300ms ease;
}
.modal[data-state="closed"] {
  animation: slideDown 200ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* Header */
.modal__header {
  padding: 25px 25px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal__header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal__badges {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.modal__score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #298267;
  color: #e7f4e8;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.14px;
}
.modal__signal-badge {
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
}
.modal__signal-badge--delivery {
  background: #e8f5e9;
  color: #298267;
}
.modal__signal-badge--247 {
  background: #ede7f6;
  color: #5e35b1;
}

.modal__rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
}
.modal__rating-star {
  color: #f4b400;
}
.modal__rating-val {
  font-weight: 700;
  color: #1f2024;
}
.modal__rating-count {
  color: #71727a;
  font-weight: 400;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #494a50;
  padding: 4px;
}
.modal__close:hover {
  color: #1f2024;
}

.modal__title-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2024;
  line-height: normal;
  font-family: var(--font-base);
}
.modal__subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #71727a;
  line-height: 16px;
  letter-spacing: 0.12px;
}

.modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.modal__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 12px;
  background: #eaf2ff;
  color: #006ffd;
  font-size: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Tabs */
.modal__tabs {
  margin: 0 25px;
}

/* Content */
.modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 25px;
  min-height: 0;
}
.modal__tab-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal__columns {
  display: flex;
  gap: 10px;
}
.modal__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Sections */
.modal__section {
  border: 1px solid #e8e9f1;
  border-radius: 15px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.modal__section--full {
  height: 100%;
}
.modal__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.modal__section-title {
  margin: 0;
  font-size: 10px;
  font-weight: 500;
  color: #8f9098;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 13px;
}
.modal__section-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal__link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 5px;
  font-weight: 500;
  color: #8f9098;
  text-decoration: none;
  border-bottom: 0.5px solid #8f9098;
}
.modal__link:hover {
  color: #494a50;
  border-bottom-color: #494a50;
}

.modal__text {
  margin: 0;
  font-size: 8px;
  font-weight: 500;
  color: #71727a;
  line-height: normal;
}

/* Location signals */
.modal__location-signals {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 3px;
}
.modal__loc-chip {
  padding: 2px 6px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #494a50;
  font-size: 8px;
  font-weight: 500;
}

/* Contacts */
.modal__contact-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
  font-weight: 500;
  color: #494a50;
}
.modal__contact-row :deep(svg) {
  color: #494a50;
  flex-shrink: 0;
}

/* Summary */
.modal__summary {
  gap: 5px;
}
.modal__summary-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
}
.modal__summary-label {
  font-weight: 500;
  color: #1f2024;
}
.modal__summary-value {
  font-weight: 700;
  color: #1f2024;
}

/* Textarea */
.modal__textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e8e9f1;
  border-radius: 12px;
  font-family: var(--font-base);
  font-size: 10px;
  color: #1f2024;
  resize: vertical;
  background: #ffffff;
  box-sizing: border-box;
}
.modal__textarea::placeholder {
  color: #8f9098;
}
.modal__textarea:focus {
  outline: none;
  border-color: #006ffd;
}

/* Score bars */
.modal__score-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
}
.modal__score-bar-label {
  width: 80px;
  flex-shrink: 0;
  font-weight: 500;
  color: #494a50;
}
.modal__score-bar-track {
  flex: 1;
  height: 6px;
  background: #f0f1f6;
  border-radius: 3px;
  overflow: hidden;
}
.modal__score-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal__score-bar-val {
  width: 30px;
  text-align: right;
  font-weight: 700;
  color: #1f2024;
}

/* Tax chart */
.modal__tax-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 80px;
  padding-top: 20px;
  padding-bottom: 20px;
  position: relative;
  margin-top: 4px;
}
.modal__tax-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  height: 100%;
}
.modal__tax-bar-val {
  font-size: 7px;
  font-weight: 600;
  color: #494a50;
  white-space: nowrap;
}
.modal__tax-bar-track {
  flex: 1;
  width: 100%;
  background: #f0f1f6;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.modal__tax-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #006ffd 0%, #4da3ff 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  min-height: 2px;
}
.modal__tax-bar-year {
  font-size: 8px;
  font-weight: 500;
  color: #8f9098;
}

/* KGD */
.modal__kgd-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  margin-top: 3px;
}
.modal__kgd-label {
  color: #71727a;
  font-weight: 500;
}
.modal__kgd-value {
  font-weight: 700;
  color: #1f2024;
}
.modal__kgd-value--debt {
  color: #e53935;
}
.modal__kgd-value--ok {
  color: #298267;
}

/* Scores */
.modal__score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
}
.modal__score-label {
  font-weight: 500;
  color: #1f2024;
}
.modal__score-value {
  font-weight: 700;
  color: #006ffd;
}

/* Branches */
.modal__branch {
  padding: 10px;
  border-radius: 6px;
  background: #f8f9fe;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.modal__branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.modal__branch-header--clickable {
  cursor: pointer;
  user-select: none;
}
.modal__branch-header--clickable:hover .modal__branch-name {
  color: #006ffd;
}
.modal__branch-right {
  display: flex;
  align-items: center;
  gap: 5px;
}
.modal__branch-name {
  font-size: 8px;
  font-weight: 600;
  color: #494a50;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}
.modal__branch-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 6px;
  font-weight: 600;
  white-space: nowrap;
}
.modal__branch-status--active {
  background: rgba(41, 130, 103, 0.15);
  color: #298267;
}
.modal__branch-status--inactive {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}
.modal__branch-cong-icon {
  font-size: 9px;
  color: #8f9098;
}
.modal__branch-address {
  margin: 0;
  font-size: 8px;
  font-weight: 400;
  color: #71727a;
}
.modal__branch-signals {
  display: flex;
  gap: 10px;
}
.modal__branch-signal {
  font-size: 8px;
  font-weight: 500;
  color: #494a50;
}
.modal__branch-heatmap {
  padding: 8px 4px 4px;
}

/* Heatmap expand transition */
.cong-expand-enter-active {
  transition: all 0.25s ease;
}
.cong-expand-leave-active {
  transition: all 0.2s ease;
}
.cong-expand-enter-from,
.cong-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Empty */
.modal__empty {
  text-align: center;
  padding: 40px 20px;
}
.modal__empty p {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #71727a;
}

/* Footer */
.modal__footer {
  display: flex;
  gap: 0;
  padding: 0 25px 25px;
}
.modal__btn {
  flex: 1;
  font-size: 10px;
  font-weight: 500;
  padding: 10px 8px;
  border-radius: 0;
}
.modal__btn:first-child {
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
}
.modal__btn:last-child {
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
  }
  .modal__columns {
    flex-direction: column;
  }
  .modal__header,
  .modal__content,
  .modal__footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  .modal__footer {
    padding-bottom: 20px;
  }
}
</style>
