<template>
    <div id="recommend">
        <Title text="推荐歌单">
            <span class="exchange" @click="getSongList"><i class="iconfont icon-huanyipi" ref="exchange"></i>换一批</span>
        </Title>
        <div class="remd_songs">
            <router-link :to="{path: '/detail', query: {songsId: item.id}}" class="remd_songs_item" v-for="(item, index) in songList" :key="index">
                <div class="remd_img">
                    <img :src="item.coverImgUrl">
                    <span><i class="iconfont icon-hanhan-01-01"></i> {{handlePlayCount(item.playCount)}}</span>
                </div>
                <p class="remd_text">{{item.name}}</p>
            </router-link>
        </div>
        <Title text="新歌速递"/>
        <Songs :songList="newSongs"/>
        <div class="footer">{{footerText}}</div>
    </div>
</template>

<script>
import Title from '@/components/Title.vue'
import Songs from '@/components/Songs.vue'
import { numberFormat } from '@/utils'

export default {
    name: 'Recommend',
    components: {
        Title,
        Songs
    },
    data(){
        return {
            songList: [],
            newSongs: [],
            allSongs: [],
            limit: 6,
            updateTime: '',
            angle: 0,
            footerText: '我是有底线的',
            startIndex: 0,
            endIndex: 10
        }
    },
    mounted(){
        this.getSongList()
        this.getNewSongs()

        window.addEventListener('scroll', () => {
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            //变量windowHeight是可视区的高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            //变量scrollHeight是滚动条的总高度
            var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            //滚动条到底部的条件
            if(scrollTop+windowHeight == scrollHeight){
            //到了这个就可以进行业务逻辑加载后台数据了
                this.footerText = '加载中...'
                setTimeout(() => {
                    this.loadMoreNewSongs()
                    this.footerText = '我是有底线的'
                }, 500)
            } 
        })
    },
    methods: {
        getSongList: function(){
            let url = ''
            if(this.updateTime == ''){
                url = `/top/playlist/highquality?limit=${this.limit}`
            }else{
                url = `/top/playlist/highquality?before=${this.updateTime}&limit=${this.limit}`
                this.rotateAnimate()
            }
            this.$axios.get(url).then(res => {
                this.songList = res.data.playlists
                this.updateTime = this.songList[this.limit - 1].updateTime
            })
        },
        getNewSongs: function(){
            this.$axios.get('/top/song?type=0').then(res => {
                this.allSongs = res.data.data
                this.newSongs = res.data.data.slice(this.startIndex, this.endIndex)
            })
        },
        handlePlayCount: function(num){
            return numberFormat(num)
        },
        rotateAnimate: function(){
            this.angle += 360
            this.$refs.exchange.style.transform = `rotate(${this.angle}deg)`
        },
        loadMoreNewSongs: function(){
            this.startIndex += 10
            this.endIndex += 10
            this.newSongs.push(...this.allSongs.slice(this.startIndex, this.endIndex))
        }
    }
}
</script>

<style lang="less" scoped>
#recommend{
    width: 100%;
    .exchange{
        float: right;
        margin: 2px 8px 0 0;
        color: #666;
        font-size: 12px;
        i{
            font-size: 14px;
            margin-right: 5px;
            transform: rotate(0deg);
            transition: transform .5s;
            display: inline-block;
        }
    }
    .remd_songs{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .remd_songs_item{
            width: 30%;
            margin-bottom: 15px;
            .remd_img{
                width: 100%;
                position: relative;
                img{
                    width: 100%;
                }
                span{
                    position: absolute;
                    top: 2px;
                    right: 5px;
                    font-size: 12px;
                    color: #fff;
                    z-index: 3;
                    i{
                        font-size: 12px;
                    }
                }
                &::after{
                    content: ' ';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 20px;
                    z-index: 2;
                    background: -webkit-linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,0));
                    background: linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,0));
                }
            }
            .remd_text{
                color: #333;
                font-size: 13px;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 30px;
                line-height: 1.3;
                display: -webkit-box;
                padding: 2px;
            }
        }
    }
    .footer{
        font-size: 14px;
        color: #666;
        text-align: center;
        padding-bottom: 10px;
    }
}
</style>