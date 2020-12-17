import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import Play from '@/pages/Play.vue'
import Recommend from '@/pages/Recommend.vue'
import Search from '@/pages/Search.vue'

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
        meta: { 
            index: 0    
        },
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
        component: Play,
        meta: { 
            index: 3
        }
    }
]

const router = new VueRouter({
    routes
})

export default router
