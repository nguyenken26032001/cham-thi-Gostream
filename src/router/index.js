import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import jwtDecode from 'jwt-decode';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                ///Competitions
                {
                    path: '/',
                    name: 'competitions-list',
                    component: () => import('@/views/competitions/List.vue'),

                },
                {
                    path: '/competitions/score/:id',
                    name: 'competitions-score',
                    component: () => import('@/views/competitions/Score.vue'),

                },
                {
                    path: '/competitions/detail/:id',
                    name: 'competitions-detail',
                    component: () => import('@/views/competitions/Detail.vue'),

                },
                {
                    path: '/competitions/create',
                    children: [
                        {
                            path: '/competitions/create',
                            name: 'competitions-create',
                            component: () => import('@/views/competitions/Create.vue'),
                        },
                        {
                            path: '/competitions/create/team/:id',
                            name: 'create-teams',
                            component: () => import('@/views/competitions/Team.vue'),
                        },
                        {
                            path: '/competitions/create/round/:id',
                            name: 'create-round',
                            component: () => import('@/views/competitions/Round.vue'),
                        }
                    ],
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/form/:competitionId/:formId',
            name: 'form',
            component: () => import('@/views/competitions/Form.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue')
        },
    ],
    scrollBehavior() {
        window.scrollTo(0, 0);
    },
});

router.beforeEach((to, from, next) => {
    // chuyển đến trang login nếu chưa được login
    const publicPages = ['login', 'register', 'form', 'thanks'];
    //log result /form/2c9e50a5-9128-4a37-a216-e77595f2442a
    const authRequired = !publicPages.includes(to.name);
    const loggedIn = JSON.parse(localStorage.getItem('user'));
    if (authRequired && jwtDecode(loggedIn.token) < Date.now()) {
        localStorage.removeItem('user')
        return next('/login');
    }
    if (authRequired && !loggedIn) {
        return next('/login');
    }
    next();
})
export default router;
