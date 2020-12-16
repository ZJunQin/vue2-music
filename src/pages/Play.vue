<template>
    <div id="play" v-if="playList.length !== 0">
        <div class="bg" ref="bg"></div>
        <audio ref="audio" muted="false" autoplay="autoplay" :src="musicUrl">
            您的浏览器不支持 audio 标签。
        </audio>
        <div class="Header">
            <i class="iconfont icon-back" @click="handleToBack"></i>
            <div class="title">
                <p class="music_name">{{musicName}}</p>
                <p class="music_singer">{{singer}}</p>
            </div>
            <i class="iconfont icon-bofangliebiaoguanli" @click="showPop"></i>
        </div>
        <div class="lyric-contain" ref="lyricContain">
            <div class="song-lyric" ref="lyric" v-if="musicUrl && musicLyric.length != 0">
                <p v-for="(item, index) in musicLyric" :key="index" :class="lyricRowActive==index?'lyric-row lyric-row-active':'lyric-row'">
                    {{item.text}}
                </p>
            </div>
            <div class="no-source" v-else>
                {{!musicUrl?'暂无资源~':'暂无歌词~'}}
            </div>
        </div>
        <div class="control">
            <div class="progress-row">
                <p class="time-now">{{formatNowTime}}</p>
                <div class="progress" ref="progress">
                    <div class="progress-now" ref="progressNow"></div>
                    <div class="progress-bar" ref="progressBar"></div>
                </div>
                <p class="time-all">{{formatAllTime}}</p>
            </div>
            <div class="btn-row">
                <div class="last_btn" @click="handleToPlayLastOrNext('last')">
                    <i class="iconfont icon-shangyishou"></i>
                </div>
                <div class="play_btn" @click="handleToPlay">
                    <i :class="isPlay && musicUrl?'iconfont icon-zantinganniu':'iconfont icon-bofanganniu'"></i>
                </div>
                <div class="next_btn" @click="handleToPlayLastOrNext('next')">
                    <i class="iconfont icon-xiayishou"></i>
                </div>
            </div>
        </div>
        <van-popup
            v-model="show"
            position="bottom"
            :style="{ maxHeight: '50%' }"
        >
            <div class="pop-header">
                <h3>当前播放列表 <span>({{playList.length}})</span></h3>
                <i class="iconfont icon-trash" @click="clearAll"></i>
            </div>
            <div class="pop-play-list">
                <ul>
                    <li v-for="(item, index) in playList" :key="index" @click="handleToSelectMusic(index)">
                        <i v-if="playingIndex == index" class="iconfont icon-bofanganniu playing"></i>
                        <p>{{item.name}} <span>- {{handleSinger(item.singers)}}</span></p>
                        <i class="iconfont icon-close" @click.stop="clearOne(index)"></i>
                    </li>
                </ul>
            </div>
        </van-popup>
    </div>
    <div class="null" v-else>
        <div class="content">
            <i class="iconfont icon-404"></i>
            <h2>播放列表空了~</h2>
            <router-link tag="p" to="/">快去添加</router-link>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Play',
    data(){
        return {
            musicUrl: '',  //歌曲资源
            musicId: null,  //歌曲id
            musicName: '',  //歌曲名
            musicSingers: [],  //歌手集
            musicLyric: [],  //歌词
            lyricRowActive: 0,  //当前播放歌词
            picUrl: '',  //歌曲背景图
            isPlay: false,  //是否正在播放
            musicTimeAll: 0,  //歌曲总时长
            musicTimeNow: 0,  //歌曲当前播放时长
            timer: null,  //计时器
            show: false  //播放列表显示/隐藏
        }
    },
    mounted(){
        //渲染背景图
        this.setBackground()

        //监听播放器播放时
        this.$refs.audio.addEventListener('play', () => {
            this.isPlay = true
            this.timer = setInterval(this.playing, 1000);
        })

        //监听播放器暂停时
        this.$refs.audio.addEventListener('pause', () => {
            this.isPlay = false
            clearInterval(this.timer)
        })

        //监听播放器播放资源准备好时
        this.$refs.audio.addEventListener('canplay', () => {
            this.musicTimeAll = this.$refs.audio.duration
            if(this.$refs.audio.autoplay){
                this.timer = setInterval(this.playing(this), 1000)
            }
        })

        //监听播放器播放完毕时
        this.$refs.audio.addEventListener('ended', () => {
            this.handleToPlayLastOrNext('next')
        })

        //监听播放进度条被点击时
        this.$refs.progress.addEventListener('click', (ev) => {
            if(ev.stopPropagation){
                ev.stopPropagation();
            }else{
                ev.cancelBubble = true;
            }
            let downX = ev.offsetX;
            let scale = downX / this.$refs.progress.offsetWidth;
            if(scale<0){
                scale = 0;
            }else if(scale > 1){
                scale = 1;
            }
            this.$refs.progressNow.style.width = scale * 100 + '%';
            this.$refs.progressBar.style.left = scale * 100 + '%'
            this.$refs.audio.currentTime = scale * this.$refs.audio.duration;
            ev.preventDefault()
        })

        //监听进度按钮被拖动时
        this.$refs.progressBar.addEventListener('touchstart', (ev) => {
            this.$refs.audio.pause()
            if(ev.stopPropagation){
                ev.stopPropagation();
            }else{
                ev.cancelBubble = true;
            }
            let downX = ev.touches[0].pageX;
            let downL = this.$refs.progressBar.offsetLeft;
            document.ontouchmove = (ev) => {
                let scale = (ev.touches[0].pageX - downX + downL + 8) / this.$refs.progressBar.parentNode.offsetWidth;
                if(scale<0){
                    scale = 0;
                }else if(scale > 1){
                    scale = 1;
                }
                this.$refs.progressNow.style.width = scale * 100 + "%";
                this.$refs.progressBar.style.left = scale * 100 + '%';
                this.$refs.audio.currentTime = scale * this.$refs.audio.duration
            }
            document.ontouchend = () => {
                document.ontouchmove = document.ontouchend = null;
                this.$refs.audio.play()
            }
            ev.preventDefault();
        })
    },
    beforeDestroy(){
        //组件卸载前清除计时器
        clearInterval(this.timer)
    },
    computed: {
        ...mapGetters("play", {
            playingMusic: "playingMusic",
            playList: "playList",
            playingIndex: "playingIndex"
        }),
        //格式化歌手
        singer: function(){
            let singer_str = ''
            this.musicSingers.map(item => {
                singer_str = singer_str + ' ' + item.name
            })
            return singer_str
        },
        //格式化当前播放时长
        formatNowTime(){
            return this.formatTime(this.musicTimeNow)
        },
        //格式化总播放时长
        formatAllTime(){
            return this.formatTime(this.musicTimeAll)
        }
    },
    watch: {
        //监听当前播放时间，歌词随之滚动
        musicTimeNow: {
            handler(){
                if(this.musicUrl.length == 0){
                    return
                }
                this.musicLyric.forEach((item, index)=>{
                    if(Math.round(this.musicTimeNow) == item.time){
                        this.$refs.lyric.style.top = - index * 30 + this.$refs.lyricContain.offsetWidth / 2 + 'px'
                        this.lyricRowActive = index
                    }
                })
            }
        },
        //监听正在播放的歌曲，切换歌曲
        playingMusic: {
            handler(){
                try{
                    const {url, id, name, singers, lyric, picUrl} = this.playingMusic
                    this.musicUrl = url
                    this.musicId = id
                    this.musicName = name
                    this.musicSingers = singers
                    this.musicLyric = this.formatLyricL(lyric)
                    this.picUrl = picUrl
                    this.setBackground()
                }catch(err){
                    console.warn('列表为空，无播放资源')
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions("play", ['playNextOrLast', 'selectMusic', 'clearAllPlayList', 'clearOneMusic']),
        //返回上一页
        handleToBack: function(){
            this.$router.go(-1)
        },
        //设置播放背景
        setBackground: function(){
            if(!this.$refs.bg)return
            this.$refs.bg.style.background = `url(${this.picUrl})`
            this.$refs.bg.style.backgroundRepeat = 'no-repeat'
            this.$refs.bg.style.backgroundSize = 'cover'
            this.$refs.bg.style.backgroundPosition = 'center'
        },
        //处理歌词，从文本转成数组，方便遍历渲染
        formatLyricL: function(text){
            let musicLyric = []
            if(!text){
                return musicLyric
            }
            let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
            let row = arr.length; //获取歌词行数
            for (let i = 0; i < row; i++) {
                let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
                let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
                let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
                //再对剩下的歌词时间进行处理
                temp_arr.forEach(element => {
                let obj = {};
                let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
                let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
                obj.time = s;
                obj.text = text;
                musicLyric.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
                });
            }
            musicLyric.sort(this.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
            musicLyric = musicLyric.filter(item => item.text)  //过滤掉歌词为空的项
            return musicLyric
        },
        //处理歌词按时间排序
        sortRule: function(a, b){
            return a.time - b.time;
        },
        //点击播放按钮
        handleToPlay: function(){
            if(this.$refs.audio.paused){
                this.$refs.audio.play()
            }else{
                this.$refs.audio.pause()
            }
        },
        //点击上一首或下一首按钮
        handleToPlayLastOrNext: async function(type){
            await this.playNextOrLast(type)
            this.handleToMusicIsNull()
        },
        //处理当前播放资源为空的情况，自动播放下一首
        handleToMusicIsNull: function(){
            if(!this.musicUrl){
                setTimeout(() => {
                    this.playNextOrLast('next')
                }, 2000)
            }
        },
        //音乐播放中处理事件
        playing: function(){
            if(!this.$refs.audio){
                return
            }
            let scale = this.$refs.audio.currentTime / this.$refs.audio.duration;
            this.musicTimeNow = this.$refs.audio.currentTime
            this.$refs.progressNow.style.width = scale * 100 + '%';
            this.$refs.progressBar.style.left = scale * 100 + '%'
        },
        //格式化播放时间
        formatTime: function(num){
            num = Math.round(num);
            let min = Math.floor(num/60);
            let sec = num%60;
            return this.setZero(min) + ':' + this.setZero(sec);
        },
        //时间小于10时，前面加0操作
        setZero: function(num){
            if(num < 10){
                return '0' + num;
            }else{
                return '' + num;
            }
        },
        //弹出播放列表
        showPop: function(){
            this.show = true
        },
        //格式化歌手，将数组转成文本
        handleSinger: function(singers){
            let singer_str = ''
            singers.map(item => {
                singer_str = singer_str + ' ' + item.name
            })
            return singer_str
        },
        //播放列表选择切歌
        handleToSelectMusic: async function(index){
            await this.selectMusic(index)
            this.handleToMusicIsNull()
        },
        //清空播放列表
        clearAll: function(){
            this.$dialog.confirm({
                title: '清空播放列表',
                message: '确认清空播放列表吗？',
                beforeClose: (action, done) => {
                    if(action === 'confirm'){
                        this.clearAllPlayList()
                        done()
                    }else{
                        done()
                    }
                }
            })
        },
        //清除播放列表里的某一首歌
        clearOne: function(index){
            this.$dialog.confirm({
                title: '清除歌曲',
                message: '确认清除该歌曲吗？',
                beforeClose: async (action, done) => {
                    if(action === 'confirm'){
                        await this.clearOneMusic(index)
                        this.handleToMusicIsNull()
                        done()
                    }else{
                        done()
                    }
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
#play{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .bg{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        /* -webkit-filter: blur(15px);
        -moz-filter: blur(15px);
        -o-filter: blur(15px);
        -ms-filter: blur(15px); */
        //filter: blur(20px);
        opacity: .5;
    }
    .Header{
        flex: 0 0 60px;
        height: 60px;
        padding: 10px;
        position: relative;
        box-sizing: border-box;
        i{
            position: absolute;
            top: 16px;
            font-size: 24px;
            color: #333;
            &.icon-back{
                left: 5px;
            }
            &.icon-bofangliebiaoguanli{
                right: 10px;
            }
        }
        .title{
            text-align: center;
            .music_name{
                font-size: 16px;
                color: #333;
                margin-bottom: 5px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 15px;
            }
            .music_singer{
                font-size: 14px;
                color: #666;
            }
        }
    }
    .lyric-contain{
        flex: 1;
        width: 100%;
        overflow: hidden;
        position: relative;
        .song-lyric{
            width: 100%;
            position: absolute;
            top: calc(50% - 30px);
            transition: top .5s;
            .lyric-row{
                text-align: center;
                font-size: 14px;
                color: #333;
                line-height: 30px;
                opacity: 0.7;
            }
            .lyric-row-active{
                font-size: 16px;
                font-weight: bold;
                opacity: 1;
            }
        }
        .no-source{
            position: absolute;
            top: calc(50% - 30px);
            width: 100%;
            line-height: 30px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
    }
    .control{
        flex: 0 0 100px;
        width: 100%;
        padding: 10px 5px;
        box-sizing: border-box;
        .progress-row{
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            .time-now{
                flex: 1;
                font-size: 12px;
                text-align: center;
            }
            .time-all{
                flex: 1;
                font-size: 12px;
                text-align: center;
            }
            .progress{
                flex: 0 0 70vw;
                width: 80vw;
                height: 2px;
                background: #666;
                position: relative;
                margin: 0 5px;
                .progress-now{
                    width: 0;
                    height: 100%;
                    background: #999;
                    position: absolute;
                    left: 0;
                    z-index: 1;
                }
                .progress-bar{
                    width: 10px;
                    height: 10px;
                    background: #fff;
                    border-radius: 50%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: -4px 0 0 -7px;
                    z-index: 2;
                }
            }
        }
        .btn-row{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .last_btn, .next_btn{
            flex: 1;
            text-align: center;
            i{
                font-size: 35px;
                color: #333;
            }
        }
        .play_btn{
            flex: 0 0 40px;
            width: 40px;
            height: 40px;
            border: 2px solid #333;
            border-radius: 50px;
            text-align: center;
            line-height: 40px;
            i{
                font-size: 28px;
                color: #333;
            }
        }
    }
    .pop-header{
        padding: 10px;
        overflow: hidden;
        line-height: 30px;
        h3{
            float: left;
            font-size: 16px;
            color: #000;
            span{
                font-size: 14px;
                color: #666;
            }
        }
        i{
            float: right;
        }
    }
    .pop-play-list{
        padding: 0 10px 10px;
        ul{
            li{
                overflow: hidden;
                line-height: 30px;
                position: relative;
                p{
                    float: left;
                    font-size: 14px;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding-left: 20px;
                    span{
                        font-size: 12px;
                        color: #666;
                    }
                }
                i{
                    float: right;
                    font-size: 14px;
                }
                .playing{
                    position: absolute;
                    left: 0;
                }
            }
        }
    }
}
.null{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
        background: none !important;
        width: 100%;
        text-align: center;
        i{
            font-size: 100px;
        }
        h2{
            font-size: 16px;
            color: #666;
            margin: 20px 0;
        }
        p{
            font-size: 14px;
            color: rgb(34, 157, 240);
            text-decoration: underline;
        }
    }
}
</style>