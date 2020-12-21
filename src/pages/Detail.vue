<template>
    <div id="Detail">
        <div class="songs-info">
            <i class="iconfont icon-back goBack" @click="handleToBack"></i>
            <div class="bg" :style="{backgroundImage: `url(${coverImgUrl})`}"></div>
            <div class="info-wrap">
                <div class="info-img">
                    <img :src="coverImgUrl">
                    <span><i class="iconfont icon-hanhan-01-01"></i>{{handlePlayCount(playCount)}}</span>
                </div>
                <div class="info-text">
                    <h2>{{name}}</h2>
                    <div class="info-auth">
                        <img :src="avatarUrl">
                        <span>{{nickname}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Title text="歌曲列表"/>
        <Songs :songList="songList"/>
    </div>
</template>

<script>
import Title from '@/components/Title.vue'
import Songs from '@/components/Songs.vue'
import { numberFormat } from '@/utils'

export default {
    name: "Detail",
    components: {
        Title,
        Songs
    },
    data(){
        return {
            songsId: '',
            name: '',
            coverImgUrl: '',
            playCount: '',
            avatarUrl: '',
            nickname: '',
            songList: [],
        }
    },
    async created(){
        this.songsId = this.$route.query.songsId
        let toast = this.$toast.loading('加载中...')
        await this.getSongsDetail()
        toast.clear()
    },
    mounted(){

    },
    methods: {
        handleToBack: function(){
            this.$router.go(-1)
        },
        getSongsDetail: function(){
            this.$axios.get(`/playlist/detail?id=${this.songsId}`).then(res => {
                if(res.data.code == 200){
                    const data = res.data.playlist
                    this.name = data.name
                    this.coverImgUrl = data.coverImgUrl
                    this.playCount = data.playCount
                    this.avatarUrl = data.creator.avatarUrl
                    this.nickname = data.creator.nickname
                    this.songList = data.tracks
                }
            })
        },
        handlePlayCount: function(num){
            return numberFormat(num)
        }
    }
}
</script>

<style lang="less" scoped>
#Detail{
    width: 100%;
    .songs-info{
        position: relative;
        padding: 40px 15px 30px;
        overflow: hidden;
        .goBack{
            position: absolute;
            left: 8px;
            top: 8px;
            font-size: 24px;
            color: #fefefe;
        }
        .bg{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 50%;
            filter: blur(20px);
            -webkit-filter: blur(20px);
            transform: scale(1.5);
            -webkit-transform: scale(1.5);
        }
        .info-wrap{
            display: flex;
            .info-img{
                width: 126px;
                height: 126px;
                position: relative;
                flex: 0 0 126px;
                img{
                    width: 100%;
                    height: 100%;
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
            .info-text{
                flex: 1 1 auto;
                margin-left: 15px;
                h2{
                    padding-top: 1px;
                    font-size: 17px;
                    line-height: 1.3;
                    color: #fefefe;
                    height: 44px;
                    display: -webkit-box;
                    -webkit-box-pack: center;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .info-auth{
                    margin-top: 20px;
                    overflow: hidden;
                    line-height: 33px;
                    img{
                        float: left;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                    span{
                        float: left;
                        font-size: 13px;
                        color: #eee;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
}
</style>