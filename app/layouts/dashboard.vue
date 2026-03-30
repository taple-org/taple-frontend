<script setup lang="ts">
</script>

<template>
  <div class="app">
    <dashboard-header/>
    <main class="app-main">
      <slot/>
    </main>
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
