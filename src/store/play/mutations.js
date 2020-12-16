import * as types from './mutation-types'

export default {
    [types.ADD_PLAY_LIST](state, music){
        state.playList.unshift(music)
        
        /**
         * 去重
         */
        let obj = {}
        state.playList = state.playList.reduce((item, next) => {
            obj[next.id] ? '' : obj[next.id] = true && item.push(next)
            return item
        }, [])

        state.playingIndex = 0
        state.playingMusic = music
        window.sessionStorage.setItem('playList', JSON.stringify(state.playList))
        window.sessionStorage.setItem('playingIndex', state.playingIndex)
    },
    [types.SWITCH_MUSIC](state, type){
        switch(type){
            case 'next': 
                if(state.playList.length - 1 == state.playingIndex){
                    state.playingIndex = 0
                }else{
                    state.playingIndex += 1
                }
                break
            case 'last':
                if(state.playingIndex == 0){
                    state.playingIndex = state.playList.length - 1
                }else{
                    state.playingIndex -= 1
                }
                break
            default:
                if(state.playingIndex == 0){
                    state.playingIndex = state.playList.length - 1
                }else{
                    state.playingIndex -= 1
                }
        }
        window.sessionStorage.setItem('playingIndex', state.playingIndex)
    },
    [types.SELECT_MUSIC](state, index){
        state.playingIndex = index
        window.sessionStorage.setItem('playingIndex', state.playingIndex)
    },
    [types.CLEAR_ALL](state){
        state.playList = []
        state.playingIndex = 0
        window.sessionStorage.removeItem('playList')
        window.sessionStorage.removeItem('playingIndex')
    },
    [types.CLEAR_ONE](state, index){
        state.playList.splice(index, 1)
        if(index < state.playingIndex){
            state.playingIndex -= 1
        }
        if(state.playList.length === 1){
            state.playingIndex = 0
        }
        window.sessionStorage.setItem('playList', JSON.stringify(state.playList))
        window.sessionStorage.setItem('playingIndex', state.playingIndex)
    }
}