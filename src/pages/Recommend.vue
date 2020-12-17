<template>
    <div id="recommend">
        <Title text="推荐歌单"/>
        <div class="remd_songs">
            <div class="remd_songs_item" v-for="(item, index) in songList" :key="index">
                <div class="remd_img">
                    <img :src="item.coverImgUrl">
                    <span><i class="iconfont icon-hanhan-01-01"></i> {{numberFormat(item.playCount)}}</span>
                </div>
                <p class="remd_text">{{item.name}}</p>
            </div>
        </div>
        <Title text="新歌速递"/>
        <Songs :songList="newSongs"/>
    </div>
</template>

<script>
import Title from '@/components/Title.vue'
import Songs from '@/components/Songs.vue'

export default {
    name: 'Recommend',
    components: {
        Title,
        Songs
    },
    data(){
        return {
            songList: [],
            newSongs: []
        }
    },
    mounted(){
        this.getSongList()
        this.getNewSongs()
    },
    methods: {
        getSongList: function(){
            this.$axios.get('/top/playlist/highquality?limit=6').then(res => {
                this.songList = res.data.playlists
            })
        },
        getNewSongs: function(){
            this.$axios.get('/top/song?type=0').then(res => {
                this.newSongs = res.data.data.slice(0, 9)
            })
        },
        numberFormat: function(num){
            let k = 10000,
                unit = ['', '万', '亿'],
                value = '',
                i
            if(num < k){
                return num
            }else{
                i = Math.floor(Math.log(num) / Math.log(k)); 
                value = ((num / Math.pow(k, i))).toFixed(2) + unit[i]
                return value
            }
        }
    }
}
</script>

<style lang="less" scoped>
#recommend{
    width: 100%;
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
}
</style>