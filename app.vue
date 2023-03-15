<template>
  <div class="h-full bg-gray-50">
    <div class="h-full">
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'RS2 Test',
  meta: [
    { name: 'description', content: 'RS2 Test.' }
  ],
  htmlAttrs: {
    class: 'h-full bg-gray-50'
  },
  bodyAttrs: {
    class: 'h-full'
  },
})
</script>