import type { TenantLeadListItem } from '~/api/generated/api'
import { TenantLeadStage } from '~/api/generated/api'
import type { Lead, LeadBranch, LeadFit } from '~/components/dashboard/leads/types'
import { getLeadStageLabel } from '~/stores/leads.store'
import { getLocalizedField, type LocalizedRecord } from '~/utils/localized'

const LIMIT = 5

function mapToLead(
    item: TenantLeadListItem,
    t: ReturnType<typeof useI18n>["t"],
    locale: string,
): Lead {
    const contacts = item.contacts ?? []

    const phones = contacts
        .filter(c => c.type === 'phone')
        .map(c => c.value ?? '')
        .filter(Boolean)

    const emails = contacts
        .filter(c => c.type === 'email')
        .map(c => c.value ?? '')
        .filter(Boolean)

    const score = Math.round((item.priority_score ?? item.fit_score ?? 0) * 100)

    const fitScores: LeadFit[] = []
    if (item.signals?.rating != null)
        fitScores.push({ label: t("leads.rating"), level: String(item.signals.rating) })
    if (item.signals?.review_count != null)
        fitScores.push({ label: t("leads.reviews"), level: String(item.signals.review_count) })
    if (item.signals?.branch_count != null)
        fitScores.push({ label: t("leads.branches"), level: String(item.signals.branch_count) })

    const locationParts = [
        getLocalizedField(item as unknown as LocalizedRecord, "address_city_name", locale),
        getLocalizedField(item as unknown as LocalizedRecord, "address_district_name", locale),
    ].filter(Boolean)
    const categoryLabel = getLocalizedField(item as unknown as LocalizedRecord, "lead_business_category_name", locale)
    const branches: LeadBranch[] = (item.branches ?? []).map((b) => ({
        id: b.id,
        name: b.name ?? "",
        fullAddress: b.full_address ?? "",
        isActive: b.is_active,
        rating: b.signals?.rating ?? 0,
        reviewCount: b.signals?.review_count ?? 0,
    }))

    return {
        id: item.id,
        score,
        title: item.lead_name,
        subtitle: categoryLabel,
        tags: categoryLabel ? [categoryLabel] : [],
        address: item.address_full ?? '',
        phone: phones[0] ?? '',
        openStatus: getLeadStageLabel(item.stage_code, t),
        contacts: phones,
        email: emails[0] ?? '',
        locationShort: locationParts.join(', '),
        fitScores,
        reasons: [],
        freshness: item.freshness_score != null
            ? `${Math.round(item.freshness_score * 100)}%`
            : '',
        branches,
    }
}

export function useLeads(workspaceId: string) {
    const { $apiClient } = useNuxtApp()
    const notification = useNotification()
    const { t, locale } = useI18n()

    const rawLeads = ref<TenantLeadListItem[]>([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const hasMore = ref(true)

    const leads = computed<Lead[]>(() => rawLeads.value.map((item) => mapToLead(item, t, locale.value)))

    async function fetchLeads() {
        isLoading.value = true
        try {
            const resp = await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
                workspaceId,
                { offset: 0, limit: LIMIT },
            )
            rawLeads.value = resp.data.result
            hasMore.value = resp.data.result.length >= LIMIT
        } catch {
            notification.error(t("common.error"), t("leads.loading"))
        } finally {
            isLoading.value = false
        }
    }

    async function fetchMore() {
        if (!hasMore.value || isLoadingMore.value) return
        isLoadingMore.value = true
        try {
            const resp = await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
                workspaceId,
                { offset: rawLeads.value.length, limit: LIMIT },
            )
            rawLeads.value.push(...resp.data.result)
            hasMore.value = resp.data.result.length >= LIMIT
        } catch {
            notification.error(t("common.error"), t("leads.loadMoreError"))
        } finally {
            isLoadingMore.value = false
        }
    }

    async function postponeLead(leadId: string) {
        const snoozed_until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19)
        try {
            await $apiClient.api.snoozeLeadApiV1LeadsTenantLeadIdSnoozePost(
                leadId,
                { tenant_id: workspaceId },
                { snoozed_until },
            )
            rawLeads.value = rawLeads.value.filter(l => l.id !== leadId)
        } catch {
            notification.error(t("common.error"), t("leads.postponeLeadError"))
        }
    }

    async function takeLead(leadId: string) {
        try {
            await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
                leadId,
                { tenant_id: workspaceId },
                { to_stage: TenantLeadStage.InProgress },
            )
            const raw = rawLeads.value.find(l => l.id === leadId)
            if (raw) raw.stage_code = TenantLeadStage.InProgress
        } catch {
            notification.error(t("common.error"), t("leads.takeLeadError"))
        }
    }

    return {
        leads,
        isLoading,
        isLoadingMore,
        hasMore,
        fetchLeads,
        fetchMore,
        postponeLead,
        takeLead,
    }
}
