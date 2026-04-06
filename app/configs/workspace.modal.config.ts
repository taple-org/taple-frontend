import { WorkspaceMakeFormScopeNaming, WorkspaceMakeFormScopeQueuing, WorkspaceMakeFormScopeTaging } from '#components'

const config = {
  naming: {
    title: 'Создание рабочего пространства',
    description: undefined,
    component: markRaw(WorkspaceMakeFormScopeNaming),
  },
  queuing: {
    title: 'Что продвигаем в первую очередь',
    description: 'Выбирайте в интересующем вас порядке',
    component: markRaw(WorkspaceMakeFormScopeQueuing),
  },
  taging: {
    title: 'Какие типы точек Вас интересуют?',
    description: 'Вы не ограничены в удалении и редактировании',
    component: markRaw(WorkspaceMakeFormScopeTaging),
  },
} as const;

export type Keys = keyof typeof config;

export default config;