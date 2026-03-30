<script setup lang="ts">
import Dropdown from "~/components/ui/Dropdown.vue";

definePageMeta({
  title: "Leads",
  layout: "dashboard",
});
const dropdownOptions = [
  { label: "Все города", value: "all" },
  { label: "Алматaaaaaaaaaaaaaaazazazazazazazazazaazaaaaa", value: "almaty" },
  { label: "Нур-Султан", value: "nur-sultan" },
  { label: "Шымкент", value: "shymkent" },
];
const lead = {
  score: 96,
  title: "Vilka на Абая",
  subtitle: "Ресторан • Еда",
  tags: [
    "POS | Торговый экваринг",
    "Интернет эквайринг",
    "Ресторанные оплаты",
    "Бизнес кредитование",
  ],
  address: "проспект Абая 131 • Бостандыкский район • Алматы",
  phone: "+7 777 123 45 67",
  openStatus: "Открыт ~3 дня",
};

const postponeLead = () => {
  // TODO: replace with business action when API endpoint is ready.
};

const takeLead = () => {
  // TODO: replace with business action when API endpoint is ready.
};
</script>

<template>
  <div class="leads">
    <!--    <dropdown :options="dropdownOptions"/> -->
    <dashboard-lead-card
      :score="lead.score"
      :title="lead.title"
      :subtitle="lead.subtitle"
      :tags="lead.tags"
      :address="lead.address"
      :phone="lead.phone"
      :open-status="lead.openStatus"
      @postpone="postponeLead"
      @take="takeLead"
    />
  </div>
</template>

<style scoped>
.leads {
  display: flex;
  justify-content: center;
  //width: 100%;
  padding: 48px 64px;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .leads {
    padding: 24px 16px;
  }
}
</style>
