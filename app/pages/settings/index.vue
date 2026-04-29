<script setup lang="ts">
definePageMeta({ layout: 'settings', middleware: "auth", })
await navigateTo('/settings/profile', { replace: true })
</script>