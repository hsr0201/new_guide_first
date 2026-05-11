<template>
  <RouterView />
</template>

<style>
/* 覆盖默认 Vue 模板布局，便于全宽展示自 Figma 导入的页面 */
#app {
  max-width: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

body {
  margin: 0;
}
</style>
