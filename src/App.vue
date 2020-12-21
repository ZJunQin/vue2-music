<template>
  <div id="app">
    <keep-alive :exclude="exclude">
      <router-view></router-view>
    </keep-alive>
    <div class="toTop" v-show="toTopShow" @click="handleToTop">
      <i class="iconfont icon-huidaodingbu"></i>
    </div>
  </div>
</template>

<script>
import { scrollAnimation } from '@/utils'

export default {
  name: 'App',
  data(){
    return {
      toTopShow: false,
      exclude: ["Play", "Detail"]
    }
  },
  mounted(){
    this.$nextTick(() => {
      window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 300){
          this.toTopShow = true
        }else{
          this.toTopShow = false
        }
      })
    })
  },
  methods: {
    handleToTop: function(){
      const currentY = document.documentElement.scrollTop || document.body.scrollTop
      scrollAnimation(currentY, 0)
    }
  }
}
</script>

<style lang="less" scope>
.toTop{
  position: fixed;
  bottom: 20px;
  right: 10px;
  i{
    color: #666;
    font-size: 40px;
    opacity: .5;
  }
}
</style>