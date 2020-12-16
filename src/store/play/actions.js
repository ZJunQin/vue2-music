import axios from 'axios'
import * as types from './mutation-types'

export default {
    getMusicUrl: function(context, id){
        return axios.get(`/song/url?id=${id}`)
    },
    getMusicInfo: function(context, id){
        return axios.get(`/song/detail?ids=${id}`)
    },
    getMusicLyric: function(context, id){
        return axios.get(`/lyric?id=${id}`)
    },
    handleMusicInfo: async function({dispatch, commit}, id){
        let music = {id}
        await dispatch('getMusicUrl', id).then(res => {
            music.url = res.data.data[0].url ? res.data.data[0].url : ''
        })
        await dispatch('getMusicInfo', id).then(res => {
            const data = res.data.songs[0]
            music.name = data.name
            music.singers = data.ar
            music.picUrl = data.al.picUrl
        })
        await dispatch('getMusicLyric', id).then(res => {
            music.lyric = res.data.lrc ? res.data.lrc.lyric : ''
        })
        commit(types.ADD_PLAY_LIST, music)
    },
    playNextOrLast: function({commit}, type){
        commit(types.SWITCH_MUSIC, type)
    },
    selectMusic: function({commit}, type){
        commit(types.SELECT_MUSIC, type)
    },
    clearAllPlayList: function({commit}){
        commit(types.CLEAR_ALL)
    },
    clearOneMusic: function({commit}, index){
        commit(types.CLEAR_ONE, index)
    }
}