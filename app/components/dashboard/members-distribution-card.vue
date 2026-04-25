<script setup lang="ts">
import type { MemberLeadsStats } from "~/api/generated/api";

interface Props {
  members: MemberLeadsStats[];
  totalLeads: number;
}

const props = defineProps<Props>();

const sortedMembers = computed(() =>
  [...props.members].sort((left, right) => right.leads_count - left.leads_count),
);

const maxLeads = computed(() =>
  sortedMembers.value.reduce(
    (max, member) => (member.leads_count > max ? member.leads_count : max),
    0,
  ),
);

const getWidth = (count: number) => {
  if (count <= 0 || maxLeads.value <= 0) return "0%";
  return String(Math.max(8, Math.round((count / maxLeads.value) * 100))) + "%";
};
</script>

<template>
  <section class="members-card">
    <div class="members-card__head">
      <h3 class="members-card__title">Распределение лидов по команде</h3>
      <span class="members-card__meta">Всего лидов: {{ totalLeads }}</span>
    </div>

    <div v-if="sortedMembers.length" class="members-card__list">
      <div
        v-for="member in sortedMembers"
        :key="member.member_id"
        class="members-card__item"
      >
        <span class="members-card__name">{{ member.full_name }}</span>
        <div class="members-card__bar-track">
          <div class="members-card__bar" :style="{ width: getWidth(member.leads_count) }" />
        </div>
        <span class="members-card__count">{{ member.leads_count }}</span>
      </div>
    </div>

    <p v-else class="members-card__empty">Нет данных по распределению лидов</p>
  </section>
</template>

<style scoped>
.members-card {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.members-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.members-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.members-card__meta {
  font-size: 12px;
  color: #8f9098;
}

.members-card__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.members-card__item {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(120px, 3fr) auto;
  align-items: center;
  gap: 12px;
}

.members-card__name {
  font-size: 13px;
  color: #494a50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.members-card__bar-track {
  height: 9px;
  background: #eef1f8;
  border-radius: 999px;
  overflow: hidden;
}

.members-card__bar {
  height: 100%;
  background: linear-gradient(90deg, #9ec0ff 0%, #bfd7ff 100%);
  border-radius: 999px;
  transition: width var(--transition-base);
}

.members-card__count {
  min-width: 32px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #2f3036;
}

.members-card__empty {
  margin: 0;
  color: #8f9098;
  font-size: 13px;
}

@media (max-width: 680px) {
  .members-card__item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .members-card__count {
    text-align: left;
  }
}
</style>
