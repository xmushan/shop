import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/Home.vue'),
    children: [

      {
        path:'/welcome',
        name:'welcome',
        component: () => import('../components/Welcome.vue')
      },
      
      {
      path: '/users',
      name: 'user',
      component: () => import('../components/Users/Users.vue')
    }]
  },


]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  if (!window.sessionStorage.getItem('token'))
    return next('/login');
  next()
})

export default router