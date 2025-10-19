<template>
  <div class="intro-layout">
    <main class="h-screen overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
// 인트로 레이아웃 스크립트
</script>

<style scoped>
/* 인트로 레이아웃 스타일 */
.intro-layout {
  height: 100vh;
  overflow: hidden;
}
</style>
