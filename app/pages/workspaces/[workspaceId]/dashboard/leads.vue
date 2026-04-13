<script setup lang="ts">
import DashboardLeadsCardsList from "~/components/dashboard/leads/cards-list.vue";
import DashboardLeadsFilters from "~/components/dashboard/leads/filters.vue";
import DashboardLeadsInfo from "~/components/dashboard/leads/info.vue";
import DashboardLeadsSearchBar from "~/components/dashboard/leads/search-bar.vue";
import DashboardLeadDetailModal from "~/components/dashboard/leads/lead-detail-modal.vue";
import type { FilterOption, Lead } from "~/components/dashboard/leads/types";
import leadsMockJson from "~/constants/leads.mock.json";

definePageMeta({
  title: "Leads",
  layout: "dashboard",
});

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

const workspaceStore = useWorkspaceStore();
workspaceStore.setCurrentWorkspace(workspaceId);

const leadsStore = useLeadsStore();
const cardsListRef = ref<InstanceType<typeof DashboardLeadsCardsList>>();

// Modal state
const isDetailModalOpen = ref(false);
const selectedLeadForModal = ref<Lead | null>(null);

const leadsMock = leadsMockJson as {
  productFilters: FilterOption[];
  pointTypeFilters: FilterOption[];
  requiredFilters: FilterOption[];
};

const cloneFilters = (filters: FilterOption[]) =>
  filters.map((filter) => ({ ...filter }));

const selectedCity = ref<string | null>(null);
const searchQuery = ref("");

const productFilters = ref<FilterOption[]>(
  cloneFilters(leadsMock.productFilters),
);
const pointTypeFilters = ref<FilterOption[]>(
  cloneFilters(leadsMock.pointTypeFilters),
);
const requiredFilters = ref<FilterOption[]>(
  cloneFilters(leadsMock.requiredFilters),
);

// Only show leads with "Новый" status
const newLeads = computed<Lead[]>(() =>
  leadsStore.leads.filter((lead) => lead.openStatus === "Новый"),
);

const dropdownOptions = computed<DropdownOption[]>(() => {
  const cities = [
    ...new Set(newLeads.value.map((l) => l.locationShort).filter(Boolean)),
  ];
  return [
    { label: "Все города", value: "" },
    ...cities.map((c) => ({ label: c, value: c })),
  ];
});

const filteredLeads = computed<Lead[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const city = selectedCity.value;

  return newLeads.value.filter((lead) => {
    const matchesCity = !city || lead.locationShort === city;
    const matchesQuery =
      !query ||
      [lead.title, lead.address, lead.phone].some((f) =>
        f.toLowerCase().includes(query),
      );
    return matchesCity && matchesQuery;
  });
});
const hoveredLeadId = ref<string | null>(null);

const selectedLead = computed(() => {
  if (hoveredLeadId.value) {
    return (
      filteredLeads.value.find((l) => l.id === hoveredLeadId.value) ??
      filteredLeads.value[0] ??
      null
    );
  }
  return filteredLeads.value[0] ?? null;
});

const handlePostpone = async (leadId: string) => {
  const success = await leadsStore.postponeLead(leadId, workspaceId);
  if (!success) {
    cardsListRef.value?.triggerShake(leadId);
  }
  // On success, lead will automatically disappear from the list
};

const handleTake = async (leadId: string) => {
  const success = await leadsStore.takeLead(leadId, workspaceId);
  isDetailModalOpen.value = false;
};

const handleShowDetails = (leadId: string) => {
  const lead = filteredLeads.value.find((l) => l.id === leadId);
  if (lead) {
    selectedLeadForModal.value = lead;
    isDetailModalOpen.value = true;
  }
};

const handleModalPostpone = (leadId: string) => {
  handlePostpone(leadId);
  isDetailModalOpen.value = false;
};

const handleModalTake = (leadId: string) => {
  handleTake(leadId);
  if (!success) {
    cardsListRef.value?.triggerShake(leadId);
  }
  // On success, lead will automatically disappear from the list
};

onMounted(() => {
  leadsStore.fetchLeads(workspaceId);
});
</script>

<template>
  <div class="leads-page">
    <div class="leads-page-container">
      <DashboardLeadsFilters
        v-model:selected-city="selectedCity"
        :dropdown-options="dropdownOptions"
        :product-filters="productFilters"
        :point-type-filters="pointTypeFilters"
        :required-filters="requiredFilters"
      />

      <span class="leads-page__sidebar-divider" aria-hidden="true" />

      <section class="leads-page__content">
        <DashboardLeadsSearchBar v-model="searchQuery" />

        <div class="leads-page__main-grid">
          <DashboardLeadsCardsList
            ref="cardsListRef"
            :leads="filteredLeads"
            @postpone="handlePostpone"
            @take="handleTake"
            @show-more="leadsStore.fetchMore"
            @details="handleShowDetails"
            @hover="hoveredLeadId = $event"
            @leave="hoveredLeadId = null"
          />

          <DashboardLeadsInfo :lead="selectedLead" />
        </div>
      </section>
    </div>

    <!-- Lead Detail Modal -->
    <DashboardLeadDetailModal
      v-model:open="isDetailModalOpen"
      :lead="selectedLeadForModal"
      @postpone="handleModalPostpone"
      @take="handleModalTake"
    />
  </div>
</template>

<style scoped>
.leads-page {
  display: flex;
  gap: 10px;
  height: 100%;
  width: 100%;
  padding: 25px 64px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: center;
}
.leads-page-container {
  display: flex;
  justify-content: center;
  height: 100%;
  gap: 10px;
  width: 80%;
  max-width: 1300px;
}
.leads-page__sidebar-divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-neutral-ld);
}

.leads-page__content {
  height: 100%;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.leads-page__main-grid {
  display: flex;
  width: 100%;
  flex: 1;
  align-items: start;
  gap: 10px;
  min-height: 0;
}

@media (max-width: 1280px) {
  .leads-page {
    padding: 20px 24px;
  }
}

@media (max-width: 980px) {
  .leads-page {
    flex-direction: column;
    gap: 16px;
  }

  .leads-page__sidebar-divider {
    display: none;
  }
}

@media (max-width: 700px) {
  .leads-page {
    padding: 24px 16px;
  }
}
</style>
