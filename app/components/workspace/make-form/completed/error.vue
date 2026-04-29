<template>
    <workspace-make-form-completed class="completed__icon-ring--error" :title="$t('workspaceCreate.errorTitle')" :description="$t('workspaceCreate.errorDescription')"> 
        <Icon size="36" name="my-icon-close" />
    </workspace-make-form-completed>
</template>
<style scoped>
.completed__icon-ring--error {
  color: var(--color-error);
}
</style>
