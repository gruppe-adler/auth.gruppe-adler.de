import Vue from 'vue';
import Router, { Route } from 'vue-router';

import { logout } from '@/services';

import LoginVue from '@/views/Login.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            component: () => import('./views/404.vue')
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: LoginVue
        },
        {
            path: '/user/:uid',
            props: true,
            meta: { requiresAuth: true },
            component: () => import(/* webpackChunkName: "profile" */ './views/User.vue')
            // beforeEnter: authenticateBeforeEnter
        },
        {
            // special route to redirect the user after he successfully logged in
            path: '/redirect',
            beforeEnter(from, to, next) {
                // check if we saved a page where the user should be redirected to
                const redirect = sessionStorage.getItem('grad-sso-redirect-after-login');
                if (redirect !== null) {
                    // clear session storage
                    sessionStorage.removeItem('grad-sso-redirect-after-login');

                    // redirect to page
                    window.location.replace(redirect);
                    return;
                }

                // redirect to profile if no redirect was given
                next('/user/me');
            }
        },
        {
            // special route. Has no component. Logs user out.
            path: '/logout',
            beforeEnter(from, to, next) {
                logout()
                    .then(() => next('/login'))
                    .catch(() => next('/login'));
            }
        },
        {
            path: '/openid/return/steam',
            component: () => import(/* webpackChunkName: "return" */ './views/Return.vue')
        },
        {
            path: '/groups',
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            },
            component: () => import(/* webpackChunkName: "admin" */ './views/Groups.vue')
        },
        {
            path: '/users',
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            },
            component: () => import(/* webpackChunkName: "admin" */ './views/Users.vue')
        },
        {
            path: '/group/create',
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            },
            component: () => import(/* webpackChunkName: "admin" */ './views/Group.vue')
        },
        {
            path: '/group/:gid',
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            },
            component: () => import(/* webpackChunkName: "admin" */ './views/Group.vue'),
            props: true
        },
        {
            path: '/403',
            component: () => import(/* webpackChunkName: "admin" */ './views/403.vue')
        }
    ]
});
