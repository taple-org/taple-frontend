import type { TenantLeadListItem } from '~/api/generated/api'
import { TenantLeadStage } from '~/api/generated/api'
import type { Lead, LeadFit } from '~/components/dashboard/leads/types'

const LIMIT = 5

const STAGE_LABELS: Record<TenantLeadStage, string> = {
    [TenantLeadStage.New]: 'Новый',
    [TenantLeadStage.Snoozed]: 'Отложен',
    [TenantLeadStage.InProgress]: 'В работе',
    [TenantLeadStage.FirstContact]: 'Первый контакт',
    [TenantLeadStage.Negotiation]: 'Переговоры',
    [TenantLeadStage.Contract]: 'Договор',
    [TenantLeadStage.Monitoring]: 'Мониторинг',
    [TenantLeadStage.Won]: 'Выигран',
    [TenantLeadStage.Lost]: 'Проигран',
    [TenantLeadStage.Hidden]: 'Скрыт',
}

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
    }
}

export const useLeadsStore = defineStore('leads', () => {
    const notification = useNotification()
    const { $apiClient } = useNuxtApp()

    const rawLeads = ref<TenantLeadListItem[]>([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const hasMore = ref(true)
    const error = ref<string | null>(null)
    const currentWorkspaceId = ref<string | null>(null)

    const leads = computed<Lead[]>(() => rawLeads.value.map(mapToLead))

    function withLoading<T extends unknown[]>(fn: (...args: T) => Promise<void>) {
        return async (...args: T): Promise<boolean> => {
            isLoading.value = true
            error.value = null
            try {
                await fn(...args)
                return true
            } catch (e: unknown) {
                if (e instanceof Error) {
                    error.value = e.message
                    notification.error('Ошибка', e.message)
                } else {
                    error.value = 'Неизвестная ошибка'
                    notification.error('Ошибка', 'Неизвестная ошибка')
                }
                return false
            } finally {
                isLoading.value = false
            }
        }
    }

    const fetchLeads = withLoading(async (workspaceId: string) => {
        currentWorkspaceId.value = workspaceId
        const resp = await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
            workspaceId,
            { offset: 0, limit: LIMIT },
        )
        rawLeads.value = resp.data.result
        hasMore.value = resp.data.result.length >= LIMIT
    })

    const fetchMore = async () => {
        if (!hasMore.value || isLoadingMore.value || !currentWorkspaceId.value) return false
        
        isLoadingMore.value = true
        error.value = null
        try {
            const resp = await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
                currentWorkspaceId.value,
                { offset: rawLeads.value.length, limit: LIMIT },
            )
            rawLeads.value.push(...resp.data.result)
            hasMore.value = resp.data.result.length >= LIMIT
            return true
        } catch (e: unknown) {
            if (e instanceof Error) {
                error.value = e.message
                notification.error('Ошибка', 'Не удалось загрузить ещё лиды')
            } else {
                error.value = 'Неизвестная ошибка'
                notification.error('Ошибка', 'Не удалось загрузить ещё лиды')
            }
            return false
        } finally {
            isLoadingMore.value = false
        }
    }

    const postponeLead = async (leadId: string, workspaceId: string) => {
        const snoozed_until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        try {
            await $apiClient.api.snoozeLeadApiV1LeadsTenantLeadIdSnoozePost(
                leadId,
                { tenant_id: workspaceId },
                { snoozed_until },
            )
            // Update the lead status instead of removing it
            const lead = rawLeads.value.find(l => l.id === leadId)
            if (lead) {
                lead.stage_code = TenantLeadStage.Snoozed
            }
            notification.success('Успешно', 'Лид отложен')
            return true
        } catch (e: unknown) {
            if (e instanceof Error) {
                error.value = e.message
                notification.error('Ошибка', 'Не удалось отложить лид')
            } else {
                error.value = 'Неизвестная ошибка'
                notification.error('Ошибка', 'Не удалось отложить лид')
            }
            return false
        }
    }

    const takeLead = async (leadId: string, workspaceId: string) => {
        try {
            await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
                leadId,
                { tenant_id: workspaceId },
                { to_stage: TenantLeadStage.InProgress },
            )
            const raw = rawLeads.value.find(l => l.id === leadId)
            if (raw) raw.stage_code = TenantLeadStage.InProgress
            notification.success('Успешно', 'Лид взят в работу')
            return true
        } catch (e: unknown) {
            if (e instanceof Error) {
                error.value = e.message
                notification.error('Ошибка', 'Не удалось взять лид в работу')
            } else {
                error.value = 'Неизвестная ошибка'
                notification.error('Ошибка', 'Не удалось взять лид в работу')
            }
            return false
        }
    }

    const clearLeads = () => {
        rawLeads.value = []
        hasMore.value = true
        currentWorkspaceId.value = null
        error.value = null
    }

    return {
        leads,
        rawLeads,
        isLoading,
        isLoadingMore,
        hasMore,
        error,
        currentWorkspaceId,

        fetchLeads,
        fetchMore,
        postponeLead,
        takeLead,
        clearLeads,
    }
})
