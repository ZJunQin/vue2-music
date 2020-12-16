import Vue from 'vue'
import Vuex from 'vuex'
import play from './play'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        play
    }
})

export default store