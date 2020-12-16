import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import Play from '@/pages/Play.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },{
        path: '/play',
        name: 'Play',
        component: Play
    }
]

const router = new VueRouter({
    routes
})

export default router
