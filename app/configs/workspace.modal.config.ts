import { WorkspaceMakeFormScopeNaming, WorkspaceMakeFormScopeQueuing, WorkspaceMakeFormScopeTaging } from '#components'

const config = {
  naming: {
    title: 'workspaceCreate.steps.naming.title',
    description: undefined,
    component: markRaw(WorkspaceMakeFormScopeNaming),
  },
  queuing: {
    title: 'workspaceCreate.steps.queuing.title',
    description: 'workspaceCreate.steps.queuing.description',
    component: markRaw(WorkspaceMakeFormScopeQueuing),
  },
  taging: {
    title: 'workspaceCreate.steps.taging.title',
    description: 'workspaceCreate.steps.taging.description',
    component: markRaw(WorkspaceMakeFormScopeTaging),
  },
} as const;

export type Keys = keyof typeof config;

export default config;
