<template>
    <workspace-make-form-completed class="completed__icon-ring--loading" title="Создание..." description="Пожалуйста, подождите"> 
        <ui-progress variant="circular"   />
    </workspace-make-form-completed>
</template>
<style scoped>
.completed__icon-ring--loading {
  color: var(--color-primary);
}
</style>