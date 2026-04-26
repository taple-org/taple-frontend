<script setup lang="ts">
import { useAuthModalController } from "~/composables/modals/useAuthModalController";

const { open } = useAuthModalController();
const { t } = useI18n();

const tenantPrice = 9;
const tenantCount = ref(1);

const totalPrice = computed(() => tenantPrice * tenantCount.value);

const benefits = computed(() => [
  {
    icon: "database",
    title: t("landing.unlimitedLeads"),
    description: t("landing.unlimitedLeadsDesc"),
  },
  {
    icon: "refresh",
    title: t("landing.autoCollection"),
    description: t("landing.autoCollectionDesc"),
  },
  {
    icon: "filter",
    title: t("landing.smartFilters"),
    description: t("landing.smartFiltersDesc"),
  },
  {
    icon: "external-link",
    title: t("landing.dataExport"),
    description: t("landing.dataExportDesc"),
  },
  {
    icon: "users",
    title: t("landing.teamWork"),
    description: t("landing.teamWorkDesc"),
  },
  {
    icon: "support",
    title: t("landing.support24"),
    description: t("landing.support24Desc"),
  },
]);

const faqItems = computed(() => [
  {
    question: t("landing.whatIsTenant"),
    answer: t("landing.whatIsTenantAnswer"),
  },
  {
    question: t("landing.canChangeTenantCount"),
    answer: t("landing.canChangeTenantCountAnswer"),
  },
  {
    question: t("landing.userLimit"),
    answer: t("landing.userLimitAnswer"),
  },
]);
</script>

<template>
  <section class="pricing-section">
    <ui-container :padding="[80, 15]">
      <!-- Hero -->
      <div class="pricing-hero">
        <h2 class="pricing-hero__title">{{ t("landing.pricingTitle") }}</h2>
        <p class="pricing-hero__subtitle">
          {{ t("landing.pricingSubtitle") }}
        </p>
      </div>

      <!-- Pricing Card -->
      <div class="pricing-card">
        <div class="pricing-card__header">
          <div class="pricing-card__badge">{{ t("landing.singlePlan") }}</div>
          <h3 class="pricing-card__title">{{ t("landing.perWorkspace") }}</h3>
        </div>

        <div class="pricing-card__price">
          <span class="pricing-card__amount">${{ tenantPrice }}</span>
          <span class="pricing-card__period">{{ t("landing.perMonth") }}</span>
        </div>

        <p class="pricing-card__description">
          {{ t("landing.fullAccess") }}
        </p>

        <!-- Calculator -->
        <div class="pricing-calculator">
          <label class="pricing-calculator__label">
            {{ t("landing.calculateCost") }}
          </label>
          <div class="pricing-calculator__controls">
            <div class="tenant-control">
              <button
                class="tenant-control__btn"
                :disabled="tenantCount <= 1"
                @click="tenantCount--"
              >
                <Icon name="my-icon:minus" class="tenant-control__icon" />
              </button>
              <span class="tenant-control__value">{{ tenantCount }}</span>
              <span class="tenant-control__label">
                {{
                  tenantCount === 1
                    ? t("landing.workspace")
                    : tenantCount < 5
                      ? t("landing.workspaces2to4")
                      : t("landing.workspaces5plus")
                }}
              </span>
              <button class="tenant-control__btn" @click="tenantCount++">
                <Icon name="my-icon:plus" class="tenant-control__icon" />
              </button>
            </div>
            <div class="pricing-calculator__total">
              <span class="pricing-calculator__total-label">{{
                t("landing.total")
              }}</span>
              <span class="pricing-calculator__total-price"
                >${{ totalPrice }}{{ t("landing.perMonthShort") }}</span
              >
            </div>
          </div>
        </div>

        <ui-button class="pricing-card__cta" @click="open('register')">
          {{ t("landing.startFree") }}
        </ui-button>

        <p class="pricing-card__note">
          {{ t("landing.trialPeriod") }}
        </p>
      </div>

      <!-- Benefits -->
      <div class="benefits-section">
        <h3 class="benefits-section__title">
          {{ t("landing.whatsIncluded") }}
        </h3>
        <div class="benefits-grid">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit-card"
          >
            <div class="benefit-card__icon">
              <Icon
                :name="`my-icon:${benefit.icon}`"
                class="benefit-card__svg"
              />
            </div>
            <h4 class="benefit-card__title">{{ benefit.title }}</h4>
            <p class="benefit-card__desc">{{ benefit.description }}</p>
          </div>
        </div>
      </div>

      <!-- Use Cases -->
      <div class="use-cases">
        <h3 class="use-cases__title">{{ t("landing.whoBenefits") }}</h3>
        <div class="use-cases__grid">
          <div class="use-case-card">
            <div class="use-case-card__icon">
              <Icon name="my-icon:user" class="use-case-card__svg" />
            </div>
            <h4 class="use-case-card__title">{{ t("landing.freelancers") }}</h4>
            <p class="use-case-card__desc">
              {{ t("landing.freelancersDesc") }}
            </p>
          </div>
          <div class="use-case-card">
            <div class="use-case-card__icon">
              <Icon name="my-icon:office-building" class="use-case-card__svg" />
            </div>
            <h4 class="use-case-card__title">
              {{ t("landing.smallBusiness") }}
            </h4>
            <p class="use-case-card__desc">
              {{ t("landing.smallBusinessDesc") }}
            </p>
          </div>
          <div class="use-case-card">
            <div class="use-case-card__icon">
              <Icon name="my-icon:briefcase" class="use-case-card__svg" />
            </div>
            <h4 class="use-case-card__title">
              {{ t("landing.largeCompanies") }}
            </h4>
            <p class="use-case-card__desc">
              {{ t("landing.largeCompaniesDesc") }}
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section">
        <h3 class="faq-section__title">{{ t("landing.faq") }}</h3>
        <div class="faq-list">
          <div v-for="item in faqItems" :key="item.question" class="faq-item">
            <h4 class="faq-item__question">{{ item.question }}</h4>
            <p class="faq-item__answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="pricing-cta">
        <h3 class="pricing-cta__title">{{ t("landing.readyToStart") }}</h3>
        <p class="pricing-cta__desc">
          {{ t("landing.tryFree") }}
        </p>
        <ui-button class="pricing-cta__btn" @click="open('register')">
          {{ t("landing.createAccount") }}
        </ui-button>
      </div>
    </ui-container>
  </section>
</template>

<style scoped>
.pricing-section {
  background: var(--color-secondary);
  padding-bottom: 80px;
}

/* Hero */
.pricing-hero {
  text-align: center;
  margin-bottom: 48px;
}

.pricing-hero__title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 12px;
}

.pricing-hero__subtitle {
  font-size: 18px;
  color: var(--color-neutral-dm);
}

/* Pricing Card */
.pricing-card {
  max-width: 640px;
  margin: 0 auto 64px;
  background: var(--color-primary);
  border-radius: 24px;
  padding: 48px;
  color: var(--color-secondary);
  text-align: center;
}

.pricing-card__header {
  margin-bottom: 24px;
}

.pricing-card__badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.pricing-card__title {
  font-size: 24px;
  font-weight: 700;
}

.pricing-card__price {
  margin-bottom: 16px;
}

.pricing-card__amount {
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
}

.pricing-card__period {
  font-size: 20px;
  opacity: 0.8;
}

.pricing-card__description {
  font-size: 16px;
  opacity: 0.85;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Calculator */
.pricing-calculator {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.pricing-calculator__label {
  display: block;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.pricing-calculator__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.tenant-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tenant-control__btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-base);
}

.tenant-control__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.tenant-control__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tenant-control__icon {
  width: 20px;
  height: 20px;
}

.tenant-control__value {
  font-size: 28px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
}

.tenant-control__label {
  font-size: 14px;
  opacity: 0.8;
}

.pricing-calculator__total {
  text-align: right;
}

.pricing-calculator__total-label {
  display: block;
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.pricing-calculator__total-price {
  font-size: 28px;
  font-weight: 700;
}

.pricing-card__cta {
  border-radius: 40px;
  padding: 14px 36px;
  font-size: 16px;
  background: var(--color-secondary);
  color: var(--color-primary);
  margin-bottom: 12px;
}

.pricing-card__cta:hover {
  opacity: 0.9;
}

.pricing-card__note {
  font-size: 13px;
  opacity: 0.7;
}

/* Benefits */
.benefits-section {
  margin-bottom: 64px;
}

.benefits-section__title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 40px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.benefit-card {
  background: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit-card__icon {
  width: 44px;
  height: 44px;
  background: var(--color-highlight-l);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.benefit-card__svg {
  width: 22px;
  height: 22px;
}

.benefit-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

.benefit-card__desc {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.5;
}

/* Use Cases */
.use-cases {
  margin-bottom: 64px;
}

.use-cases__title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 40px;
}

.use-cases__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.use-case-card {
  background: var(--color-highlight-l);
  border-radius: var(--radius-md);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.use-case-card__icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
}

.use-case-card__svg {
  width: 24px;
  height: 24px;
}

.use-case-card__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.use-case-card__desc {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

/* FAQ */
.faq-section {
  margin-bottom: 64px;
}

.faq-section__title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 40px;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  background: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 24px;
}

.faq-item__question {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin-bottom: 8px;
}

.faq-item__answer {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

/* CTA */
.pricing-cta {
  text-align: center;
  background: var(--color-primary);
  border-radius: 20px;
  padding: 48px;
  color: var(--color-secondary);
}

.pricing-cta__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.pricing-cta__desc {
  font-size: 16px;
  opacity: 0.85;
  margin-bottom: 24px;
}

.pricing-cta__btn {
  background: var(--color-secondary);
  color: var(--color-primary);
  border-radius: 40px;
  padding: 14px 36px;
  font-size: 16px;
}

.pricing-cta__btn:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 900px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .use-cases__grid {
    grid-template-columns: 1fr;
  }
  .pricing-hero__title {
    font-size: 32px;
  }
  .pricing-card {
    padding: 32px 24px;
  }
  .pricing-card__amount {
    font-size: 56px;
  }
  .pricing-calculator__controls {
    flex-direction: column;
    gap: 16px;
  }
  .pricing-calculator__total {
    text-align: center;
  }
}

@media (max-width: 560px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  .pricing-hero__title {
    font-size: 28px;
  }
  .pricing-card {
    padding: 24px 16px;
  }
  .pricing-card__amount {
    font-size: 48px;
  }
  .tenant-control {
    gap: 8px;
  }
  .tenant-control__value {
    font-size: 24px;
    min-width: 32px;
  }
  .tenant-control__label {
    font-size: 12px;
  }
}
</style>
