<script setup lang="ts">
import type { DropdownOption } from "~/components/ui/Dropdown.vue";
import DashboardLeadsCardsList from "~/components/dashboard/leads/cards-list.vue";
import DashboardLeadsFilters from "~/components/dashboard/leads/filters.vue";
import DashboardLeadsInfo from "~/components/dashboard/leads/info.vue";
import DashboardLeadsSearchBar from "~/components/dashboard/leads/search-bar.vue";
import type { FilterOption, Lead } from "~/components/dashboard/leads/types";
import leadsMockJson from "~/constants/leads.mock.json";

definePageMeta({
  title: "Leads",
  layout: "dashboard",
});

const leadsMock = leadsMockJson as {
  dropdownOptions: DropdownOption[];
  productFilters: FilterOption[];
  pointTypeFilters: FilterOption[];
  requiredFilters: FilterOption[];
  leads: Lead[];
};

const cloneFilters = (filters: FilterOption[]) =>
  filters.map((filter) => ({ ...filter }));

const dropdownOptions: DropdownOption[] = leadsMock.dropdownOptions;

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

const leads = ref<Lead[]>(leadsMock.leads);
const visibleLeadsCount = ref(5);

const filteredLeads = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  const filtered = query
    ? leads.value.filter((lead) => {
        return [lead.title, lead.address, lead.phone].some((field) =>
          field.toLowerCase().includes(query),
        );
      })
    : leads.value;

  return filtered.slice(0, visibleLeadsCount.value);
});

const selectedLead = computed(() => filteredLeads.value[0] ?? null);

const postponeLead = (_leadTitle: string) => {
  // TODO: replace with business action when API endpoint is ready.
};

const takeLead = (_leadTitle: string) => {
  // TODO: replace with business action when API endpoint is ready.
};

const showMoreLeads = () => {
  visibleLeadsCount.value += 3;
};
</script>

<template>
  <div class="leads-page">
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
          :leads="filteredLeads"
          @postpone="postponeLead"
          @take="takeLead"
          @show-more="showMoreLeads"
        />

        <DashboardLeadsInfo :lead="selectedLead" />
      </div>
    </section>
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
  display: grid;
  width: 100%;
  flex: 1;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 1280px) {
  .leads-page {
    padding: 20px 24px;
  }

  .leads-page__main-grid {
    grid-template-columns: minmax(0, 1fr);
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

  .leads-page__main-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 700px) {
  .leads-page {
    padding: 24px 16px;
  }
}
</style>
