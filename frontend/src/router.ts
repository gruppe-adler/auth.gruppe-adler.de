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
            path: '/profile',
            component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
            // beforeEnter: authenticateBeforeEnter
        },
        {
            path: '/profile/:uid',
            props: true,
            component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
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
                next('/profile');
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
            component: () => import(/* webpackChunkName: "admin" */ './views/Groups.vue')
        },
        {
            path: '/users',
            component: () => import(/* webpackChunkName: "admin" */ './views/Users.vue')
        },
        {
            path: '/group/create',
            component: () => import(/* webpackChunkName: "admin" */ './views/Group.vue')
        },
        {
            path: '/group/:gid',
            component: () => import(/* webpackChunkName: "admin" */ './views/Group.vue'),
            props: true
        },
        {
            path: '/unauthorized',
            component: () => import(/* webpackChunkName: "admin" */ './views/Unauthorized.vue')
        }
    ]
});
