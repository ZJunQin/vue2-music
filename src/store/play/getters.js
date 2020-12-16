export default {
    playList: state => state.playList,
    playingIndex: state => state.playingIndex,
    playingMusic: state => state.playList[state.playingIndex]
}