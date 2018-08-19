<template>
  <div id="app" class="full">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.full {
  width: 100%;
  height: 100%;
}
</style>
