<template>
    <div class="songs">
        <div class="song-result">
            <div class="song-result-item" v-for="(item, index) in songList" :key="index" @click="handleToPlay(item.id)">
            <div class="song-result-word">
                <div>{{item.name}}</div>
                <div>{{handleSinger(item.artists?item.artists:item.ar)}}</div>
            </div>
            <i class="iconfont icon-bofanganniu"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'Songs',
    props: {
        songList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        ...mapActions('play', ['handleMusicInfo']),
        handleToPlay: async function(id){
            let toast = this.$toast.loading('加载中...')
            await this.handleMusicInfo(id)
            toast.clear()
            this.$router.push('/play')
        },
        //格式化歌手，将数组转成文本
        handleSinger: function(singers){
            let singer_str = ''
            singers.map(item => {
                singer_str = singer_str + '/' + item.name
            })
            return singer_str.substr(1)
        },
    }
}
</script>

<style lang="less" scoped>
.songs{
    width: 100%;
    .song-result{
        border-top: 1px solid #e4e4e4;
        padding: 15px;
    }
    .song-result-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        margin-bottom: 15px;
        border-bottom: 1px solid #e4e4e4;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .song-result-word div:nth-child(1){
        font-size: 16px;
        color: #333;
        margin-bottom: 6px;
    }
    .song-result-word div:nth-child(2){
        font-size: 12px;
        color: #898989;
    }
    .song-result-item i{
        font-size: 25px;
        color: #999;
    }
}
</style>