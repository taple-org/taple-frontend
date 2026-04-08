<script lang="ts" setup>
import {useWorkspaceMakeFlow} from '~/composables/workspace/useWorkspaceMakeFlow';
import type {ProfileListConfig, ProfileListItem} from '~/interfaces/profile.interfaces';

const controller = useWorkspaceMakeFlow();
const {user} = storeToRefs(useAuthStore());
const {signOut} = useAuthStore();
const {$apiClient} = useNuxtApp();
const workspaceStore = useWorkspaceStore();
const router = useRouter();

const {data: tenats, error} = useAsyncData(() => $apiClient.api.listMyTenantsApiV1TenantsGet(), {lazy: true});

const configs = computed<ProfileListConfig>(() => {
  return [
    {
      title: 'Профиль',
      icon: 'my-icon:profile',
      type: 'link',
      to: '#'
    },
    {
      title: 'Безопасность',
      icon: 'my-icon:settings',
      type: 'link',
      to: '#'
    },
    {
      title: 'Рабочие пространства',
      icon: 'my-icon:categories',
      type: 'nested',
      full: true,
      items: [...(tenats.value?.data.result.map((tenat): ProfileListItem => ({
        type: 'action',
        title: tenat.name,
        action: () => {
          workspaceStore.setCurrentWorkspace(tenat.id);
          router.push(`/workspaces/${tenat.id}/dashboard/leads`);
        }
      })) ?? []), {
        title: 'Создать',
        description: 'Добавить новое рабочее пространство',
        icon: 'my-icon:add',
        type: 'action',
        action: () => {
          controller.open();
        }
      }]
    }]

})

</script>
<template>
    <ui-popover class="profile" placement="bottom" :offset="{ mainAxis: 36 }">
        <template #trigger>
            <ui-badge class="">
              {{ user?.email }}
            </ui-badge>
        </template>
        <template #default>
            <section class="profile__content">
                <ul class="profile__list">
                    <template v-for="element in configs" :key="element.title">
                        <li :class="{ 'profile__list-item--full': element.full }">
                            <app-header-profile-list-link-item v-if="element.type === 'link'" v-bind="element" />
                            <app-header-profile-list-nested-item v-else-if="element.type === 'nested'"
                                v-bind="element" />
                            <app-header-profile-list-action-item v-else-if="element.type === 'action'"
                                v-bind="element" />
                        </li>
                    </template>
                </ul>
                <ui-button class="profile__logout" variant="error" @click="signOut">
                    Выйти
                </ui-button>
            </section>
        </template>
    </ui-popover>
</template>
<style>
.profile__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 800px;
    padding: 30px;
}

.profile__list {
    display: grid;
    row-gap: 10px;
    column-gap: 10px;
    align-self: stretch;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.profile__list-item--full {
    grid-column: 1 / span 2;

}
</style>