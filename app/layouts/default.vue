<script setup lang="ts">
</script>

<template>
  <div class="app">
    <app-header/>
    <main class="app-main">
      <slot/>
    </main>
    <app-footer />
  </div>
</template>

<style scoped>
.app{
  display: flex;
  flex-direction: column;
}
.app-main{
  flex-grow: 1;
}
</style>
