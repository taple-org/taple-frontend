<template>
    <workspace-make-form-completed 
    :title="$t('workspaceCreate.successTitle')" 
    :description="$t('workspaceCreate.successDescription')"
    class="completed__icon-ring--success"
    >
        <Icon size="36" name="my-icon-check" />
    </workspace-make-form-completed>
</template>
<style scoped>
.completed__icon-ring--success {
  color: var(--color-success);
}

</style>
