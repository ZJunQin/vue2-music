<template>
  <div id="home">
    <van-tabs @click="switchTab" v-model="activeName">
      <van-tab title="推荐" name="recommend"></van-tab>
      <van-tab title="搜索" name="search"></van-tab>
    </van-tabs>
    <transition :name="transitionName">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
        transitionName: 'slide-left',
        activeName: ''
    }
  },
  created(){
    this.activeName = this.$route.path.replace('/', '')
  },
  mounted(){
    this.activeName = this.$route.path.replace('/', '')
  },
  watch: {
    '$route' (to, from){
      this.activeName = to.name.toLowerCase()
      const toIndex = to.meta.index
      const fromIndex = from.meta.index
      this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left'
    }
  },
  methods: {
    switchTab: function(name){
      this.$router.push(`/${name}`)
    }
  }
}
</script>

<style lang="less" scope>

</style>