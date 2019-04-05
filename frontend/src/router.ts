import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'grad-nav--active',
  linkExactActiveClass: '',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/groups',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/users',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/logout',
      component: () => import('./views/Profile.vue')
    }
  ]
});
