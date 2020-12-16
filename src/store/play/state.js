export default {
    playList: window.sessionStorage.getItem('playList') ? JSON.parse(window.sessionStorage.getItem('playList')) : [],
    playingIndex: window.sessionStorage.getItem('playingIndex') ? window.sessionStorage.getItem('playingIndex') : 0
}