export const useWorkspaceStore = defineStore('workspace', () => {
    const currentWorkspaceId = ref<string | null>(null)

    function setCurrentWorkspace(id: string) {
        currentWorkspaceId.value = id
    }

    return { currentWorkspaceId, setCurrentWorkspace }
})
