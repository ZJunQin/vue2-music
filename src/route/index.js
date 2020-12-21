import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import Play from '@/pages/Play.vue'
import Recommend from '@/pages/Recommend.vue'
import Search from '@/pages/Search.vue'
import Detail from '@/pages/Detail.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/recommend',
        children: [
            {
                path: '/recommend',
                name: 'Recommend',
                component: Recommend,
                meta: {
                    index: 1
                }
            },
            {
                path: '/search',
                name: 'Search',
                component: Search,
                meta: {
                    index: 2
                }
            }
        ]
    },{
        path: '/play',
        name: 'Play',
        component: Play
    },{
        path: '/detail',
        name: 'Detail',
        component: Detail
    }
]

const router = new VueRouter({
    routes
})

export default router
