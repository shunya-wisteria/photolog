import Vue          from 'vue'
import Router       from 'vue-router'
import store        from '@/store'
import HelloWorld   from '@/components/HelloWorld.vue'
import PhotoMap     from '@/components/PhotoMap.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: HelloWorld
      },
      {
          path: '/map/:uid',
          name: 'photoMap',
          component: PhotoMap
      }
    ]
})

router.beforeEach((to, from, next)=> async function(){
    if(to.query["mode"]==1)
    {
        console.log("full screen mode")
        store.commit('setShowAsFull', true)
    }
    else
    {
        store.commit('setShowAsFull', false)
    }

    next()
}())

export default router