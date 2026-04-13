import type { TenantLeadStage } from '~/api/generated/api'

const activeDrag = ref<{
    cardId: string
    fromStage: TenantLeadStage
} | null>(null)

export const usePipelineDrag = () => {
    const startDrag = (cardId: string, fromStage: TenantLeadStage) => {
        activeDrag.value = { cardId, fromStage }
    }
    const clearDrag = () => {
        activeDrag.value = null
    }
    return { activeDrag, startDrag, clearDrag }
}