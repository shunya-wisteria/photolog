import Vue          from 'vue'
import Router       from 'vue-router'
import store        from '@/store'
import Home         from '@/components/Home.vue'
import PhotoMap     from '@/components/PhotoMap.vue'
import Login        from '@/components/Login.vue'
import Insert       from '@/components/Insert.vue'
import Edit         from '@/components/Edit.vue'
import Migrate      from '@/components/Migrate.vue'
import { migrate } from '../store/modules/migrate'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/map/:uid',
        name: 'photoMap',
        component: PhotoMap
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/insert',
        name: 'insert',
        component: Insert
      },
      {
        path: '/detail/:id',
        name: 'detail',
        component: Edit 
      }

      // {
      //     path: '/migrate',
      //     component: Migrate
      // }
    ]
})

router.beforeEach((to, from, next)=> async function(){
    if(to.query["mode"]==1)
    {
        store.commit('setShowAsFull', true)
    }
    else
    {
        store.commit('setShowAsFull', false)
    }

    if(to.query["refurl"]==1)
    {
      store.commit('setShowRefUrl', true)
    }
    else
    {
      store.commit('setShowRefUrl', false)
    }

    next()
}())

export default router