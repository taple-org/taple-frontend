<script setup lang="ts">
import type { CongestionRead } from "~/api/generated/api";

const props = defineProps<{
  congestion: CongestionRead;
}>();

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const HOUR_LABELS = ["0", "3", "6", "9", "12", "15", "18", "21"];

// Build grid[dayIdx][hour] = level
const grid = computed(() => {
  const g: number[][] = DAYS.map(() => new Array(24).fill(0));
  for (const levelObj of props.congestion.levels ?? []) {
    for (const [day, hours] of Object.entries(levelObj.days)) {
      const dayIdx = DAYS.indexOf(day);
      if (dayIdx === -1) continue;
      for (const hour of hours ?? []) {
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) continue;
        g[dayIdx][hour] = levelObj.level;
      }
    }
  }
  return g;
});

const getColor = (level: number): string => {
  if (level === 0) return "#F0F1F6";
  if (level <= 2) return "#C8E6C9";
  if (level <= 4) return "#A5D6A7";
  if (level <= 5) return "#FFE082";
  if (level <= 7) return "#FFAB40";
  if (level <= 9) return "#FF7043";
  return "#E53935";
};

const avgDisplay = computed(() =>
  Math.round((props.congestion.avg_level ?? 0) * 10) / 10,
);

const peakLabel = computed(() => {
  const tags = [];
  if (props.congestion.evening_peak) tags.push("вечером");
  if (props.congestion.weekend_peak) tags.push("в выходные");
  return tags.join(", ");
});
</script>

<template>
  <div class="cong">
    <!-- Summary chips -->
    <div class="cong__summary">
      <span class="cong__chip cong__chip--avg">
        Ср. загруженность: {{ avgDisplay }}/10
      </span>
      <span v-if="congestion.evening_peak || congestion.weekend_peak" class="cong__chip cong__chip--peak">
        Пик {{ peakLabel }}
      </span>
      <span class="cong__chip cong__chip--hours">
        {{ congestion.peak_hours_count ?? 0 }} ч. в пике
      </span>
    </div>

    <!-- Heatmap grid -->
    <div class="cong__grid-wrap">
      <!-- Hour labels row -->
      <div class="cong__hour-row">
        <span class="cong__day-stub" />
        <div class="cong__hours-track">
          <span
              v-for="(label, i) in HOUR_LABELS"
              :key="i"
              class="cong__hour-label"
              :style="{ left: `${(i / 8) * 100}%` }"
          >{{ label }}</span>
        </div>
      </div>

      <!-- Day rows -->
      <div
          v-for="(dayLabel, dIdx) in DAY_RU"
          :key="dIdx"
          class="cong__row"
          :class="{ 'cong__row--weekend': dIdx >= 5 }"
      >
        <span class="cong__day-label">{{ dayLabel }}</span>
        <div class="cong__cells">
          <div
              v-for="hour in 24"
              :key="hour - 1"
              class="cong__cell"
              :style="{ background: getColor(grid[dIdx][hour - 1]) }"
              :title="`${dayLabel} ${hour - 1}:00 — уровень ${grid[dIdx][hour - 1] || '–'}`"
          />
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="cong__legend">
      <span class="cong__legend-label">Тихо</span>
      <div class="cong__legend-scale">
        <div
            v-for="l in 10"
            :key="l"
            class="cong__legend-step"
            :style="{ background: getColor(l) }"
        />
      </div>
      <span class="cong__legend-label">Загружено</span>
    </div>
  </div>
</template>

<style scoped>
.cong {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Summary chips */
.cong__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.cong__chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  line-height: normal;
}

.cong__chip--avg {
  background: #EAF2FF;
  color: #006FFD;
}

.cong__chip--peak {
  background: #FFF3E0;
  color: #E65100;
}

.cong__chip--hours {
  background: #F3E5F5;
  color: #7B1FA2;
}

/* Grid */
.cong__grid-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cong__hour-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cong__day-stub {
  width: 18px;
  flex-shrink: 0;
}

.cong__hours-track {
  flex: 1;
  position: relative;
  height: 12px;
}

.cong__hour-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 8px;
  font-weight: 500;
  color: #8F9098;
}

.cong__row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cong__day-label {
  width: 18px;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 600;
  color: #71727A;
  text-align: right;
}

.cong__row--weekend .cong__day-label {
  color: #E65100;
}

.cong__cells {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 1.5px;
}

.cong__cell {
  height: 12px;
  border-radius: 2px;
  transition: opacity 0.15s;
  cursor: default;
}

.cong__cell:hover {
  opacity: 0.7;
  outline: 1px solid rgba(0, 0, 0, 0.2);
}

/* Legend */
.cong__legend {
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: flex-end;
}

.cong__legend-label {
  font-size: 8px;
  font-weight: 500;
  color: #8F9098;
  white-space: nowrap;
}

.cong__legend-scale {
  display: flex;
  gap: 1.5px;
}

.cong__legend-step {
  width: 10px;
  height: 8px;
  border-radius: 1px;
}
</style>
