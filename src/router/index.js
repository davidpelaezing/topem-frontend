import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CrearView from '../views/CrearView.vue'
import EditarView from '../views/EditarView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta : { requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/crear',
    name: 'crear',
    component: CrearView,
    meta : { requiresAuth: true}
  },
  {
    path: '/editar/:id',
    name: 'editar',
    component: EditarView,
    meta : { requiresAuth: true}
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(route => route.meta.requiresAuth)){
    if(!localStorage.getItem('loggedIn')){
      next('/login');
    }else{
      next();
    }
  }else{
    next();
  }
});

export default router
