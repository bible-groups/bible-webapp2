<template>
  <div class="about">
    <h1 class="text-3xl font-bold">About</h1> 
    <p>About 페이지입니다.</p>
  </div>
</template>

<script setup>
  useHead({
    title: 'GSEED | About',
    meta: [
      { name: 'description', content: 'GSEED About'}
    ]
  })
definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped lang="scss">

</style>