<template>
    <div id="search">
        <div class="search-input">
            <i class="iconfont icon-search"></i>
            <input type="text" placeholder="搜索歌曲" v-model="searchWord" @input="handleToSuggest" @keyup.enter="handleToList(searchWord)">
            <i class="iconfont icon-close" v-if="searchType !== 1" @click="handleClose"></i>
        </div>
        <template v-if="searchType === 1">
        <div class="search-history">
            <div class="search-history-head">
            <span>历史记录</span>
            <i class="iconfont icon-trash" @click="handleToClear"></i>
            </div>
            <div class="search-history-list">
            <div v-for="(item, index) in searchHistory" :key="index" @click="handleToList(item)">{{item}}</div>
            </div>
        </div>
        <div class="search-hot">
            <div class="search-hot-head">热搜榜</div>
            <div class="search-hot-item" v-for="(item, index) in searchHot" :key="index" @click="handleToList(item.searchWord)">
            <div class="search-hot-top">{{index + 1}}</div>
            <div class="search-hot-word">
                <div>{{item.searchWord}}<img v-if="item.iconUrl" :src="item.iconUrl" alt=""></div>
                <div>{{item.content}}</div>
            </div>
            <span class="search-hot-count">{{item.score}}</span>
            </div>
        </div>
        </template>
        <template v-else-if="searchType === 2">
          <Songs :songList="searchList"/>
        </template>
        <template v-else-if="searchType === 3">
        <div class="search-suggest">
            <div class="search-suggest-head">搜索'{{searchWord}}'</div>
            <div class="search-suggest-item" v-for="(item, index) in searchSuggest" :key="index" @click="handleToList(item.keyword)">
            <i class="iconfont icon-search"></i>{{item.keyword}}
            </div>
        </div>
        </template>
    </div>
</template>

<script>
import { setStorage, getStorage, removeStorage, debounce } from '../utils'
import Songs from '@/components/Songs.vue'

export default {
    name: 'Search',
    data() {
        return {
            searchType: 1,
            searchHot: [],
            searchWord: '',
            searchSuggest: [],
            searchList: [],
            searchHistory: []
        }
    },
    components: {
      Songs
    },
    mounted(){
        this.getSearchHot()

        getStorage({
            key: 'searchHistory',
            success: (data)=> {
                if(data){
                    this.searchHistory = data
                }
            }
        })
    },
    methods: {
      getSearchHot(){
          this.$axios.get('/search/hot/detail').then(res => {
              this.searchHot = res.data.data
          })
      },
      handleToSuggest: debounce(function(){
          if(!this.searchWord){
            this.searchType = 1
            return
          }

          this.$axios.get(`/search/suggest?keywords=${this.searchWord}&type=mobile`).then(res => {
              this.searchSuggest = res.data.result.allMatch
              this.searchType = 3
          })
      }, 150),
      handleClose() {
          this.searchType = 1
          this.searchWord = ''
      },
      getSearchList(keyword) {
          this.$axios.get(`/search?keywords=${keyword}`).then(res => {
              this.searchList = res.data.result.songs
              this.searchType = 2
              window.scrollTo(0, 0)
          })
      },
      async handleToList(keyword) {
          this.searchWord = keyword
          this.searchHistory.unshift(keyword)
          this.searchHistory = [...new Set(this.searchHistory)] // 过滤掉重复的子项
          if (this.searchHistory.length > 10) {
              this.searchHistory.length = 10
          }
          setStorage({
              key: 'searchHistory',
              data: this.searchHistory
          })
          await this.getSearchList(keyword);
      },
      handleToClear() {
          removeStorage({
              key: 'searchHistory',
              success: () => {
              this.searchHistory = []
              }
          })
      },
      
    }
}
</script>

<style lang="less" scoped>
i{
    color: #999;
}
.search-input{
  display: flex;
  align-items: center;
  height: 35px;
  margin: 35px 15px 25px 15px;
  background-color: #f7f7f7;
  border-radius: 25px;
}
.search-input i{
  margin: 0 13px;
}
.search-input input {
  flex: 1;
  font-size: 14px;
  border: none;
  background: #f7f7f7;
  outline: none;
}
.search-history {
  margin: 0 15px;
  font-size: 14px;
}
.search-history-head{
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}
.search-history-list{
  display: flex;
  flex-wrap: wrap;
}
.search-history-list div{
  padding: 8px 14px;
  border-radius: 20px;
  margin-right: 15px;
  margin-bottom: 15px;
  background: #f7f7f7;
}
.search-hot{
  margin: 0 15px;
  font-size: 14px;
}
.search-hot-head{
  margin-bottom: 18px;
}
.search-hot-item{
  display: flex;
  align-items: center;
  margin-bottom: 29px;
}
.search-hot-top{
  color: #fb2222;
  width: 30px;
  margin-left: 4px;
}
.search-hot-word{
  flex: 1;
}
.search-hot-word div:nth-child(1){
  font-size: 16px;
  color: black;
}
.search-hot-word div:nth-child(2) {
  font-size: 12px;
  color: #878787;
}
.search-hot-word img {
  height: 12px;
}
.search-hot-count{
  color: #878787;
}
.search-suggest{
  border-top: 1px solid #e4e4e4;
  padding: 15px;
  font-size: 14px;
}
.search-suggest-head{
  color: #4574a5;
  margin-bottom: 37px;
}
.search-suggest-item{
  color: #5d5d5d;
  margin-bottom: 37px;
}
.search-suggest-item i{
  color: #bdbdbd;
  margin-right: 14px;
  position: relative;
  top: 1px;
}
</style>