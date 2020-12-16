<template>
  <div id="app">
    <keep-alive exclude="Play">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>