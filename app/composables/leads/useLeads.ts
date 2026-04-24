import type { TenantLeadListItem } from '~/api/generated/api'
import { TenantLeadStage } from '~/api/generated/api'
import type { Lead, LeadBranch, LeadFit } from '~/components/dashboard/leads/types'
import { STAGE_LABELS } from '~/stores/leads.store'

const LIMIT = 5

function mapToLead(item: TenantLeadListItem): Lead {
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
        fitScores.push({ label: 'Рейтинг', level: String(item.signals.rating) })
    if (item.signals?.review_count != null)
        fitScores.push({ label: 'Отзывы', level: String(item.signals.review_count) })
    if (item.signals?.branch_count != null)
        fitScores.push({ label: 'Филиалы', level: String(item.signals.branch_count) })

    const locationParts = [item.address_city_name_ru, item.address_district_name_ru].filter(Boolean)
    const branches: LeadBranch[] = (item.branches ?? []).map((b) => ({
        id: b.id,
        name: b.name,
        fullAddress: b.full_address,
        isActive: b.is_active,
        rating: b.signals?.rating,
        reviewCount: b.signals?.review_count,
    }))

    return {
        id: item.id,
        score,
        title: item.lead_name,
        subtitle: item.lead_business_category_name_ru,
        tags: [item.lead_business_category_name_ru],
        address: item.address_full ?? '',
        phone: phones[0] ?? '',
        openStatus: STAGE_LABELS[item.stage_code] ?? item.stage_code,
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

    const rawLeads = ref<TenantLeadListItem[]>([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const hasMore = ref(true)

    const leads = computed<Lead[]>(() => rawLeads.value.map(mapToLead))

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
            notification.error('Ошибка', 'Не удалось загрузить лиды')
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
            notification.error('Ошибка', 'Не удалось загрузить ещё лиды')
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
            notification.error('Ошибка', 'Не удалось отложить лид')
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
            notification.error('Ошибка', 'Не удалось взять лид в работу')
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
