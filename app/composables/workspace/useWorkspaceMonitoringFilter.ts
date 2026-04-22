interface WorkspaceMonitoringFilterState {
  search: string,
  category_code: string,
  responsible_id: string,
}

export const useWorkspaceMonitoringFilter = () => {
  const draft = reactive<WorkspaceMonitoringFilterState>({
    search: "",
    category_code: "",
    responsible_id: "",
  });

  const state = reactive<WorkspaceMonitoringFilterState>({
    search: "",
    category_code: "",
    responsible_id: "",
  });

  const apply = () => {
    Object.assign(state, draft);
  };

  const reset = () => {
    Object.assign(draft, {
      search: "",
      category_code: "",
      responsible_id: "",
    });
    Object.assign(state, draft);
  };

  const { r$: form } = useRegle(draft, {});

  return { form, draft, state, apply, reset };
};
