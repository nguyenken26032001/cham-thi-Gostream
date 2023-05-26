import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import jwt_decode from 'jwt-decode';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'competitions-list',
            component: () => import('@/views/competitions/List.vue'),
            meta: { requiresAuth: true },
            component: AppLayout,
            children: [
                ///Competitions
                {
                    path: '',
                    name: 'competitions-list',
                    component: () => import('@/views/competitions/List.vue'),
                    meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/competitions/list',
                    name: 'competitions-list',
                    component: () => import('@/views/competitions/List.vue'),
                    meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/competitions/examiner-list',
                    name: 'competitions-examiner-list',
                    component: () => import('@/views/marks/listCompetitionByExaminer.vue'),
                    meta: { requiresAuth: true, role: 'examiner' }
                },
                {
                    path: '/competitions/detail/:id',
                    name: 'competitions-detail',
                    component: () => import('@/views/competitions/Detail.vue'),
                    meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/competitions/create',
                    children: [
                        {
                            path: '/competitions/create',
                            name: 'competitions-create',
                            component: () => import('@/views/competitions/Create.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                        },
                        {
                            path: '/competitions/create/team/:id',
                            name: 'create-teams',
                            component: () => import('@/views/competitions/Team.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                        },
                        {
                            path: '/competitions/create/round/:id',
                            name: 'create-round',
                            component: () => import('@/views/competitions/Round.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                        }
                    ]
                },
                {
                    path: '/examiner/view-competition/Team/:id',
                    name: 'examiner-view-competition-teams',
                    component: () => import('@/views/marks/viewTeam.vue'),
                    meta: { requiresAuth: true, role: 'examiner' }
                },
                {
                    path: '/examiner/view-competition/:id',
                    name: 'examiner-view-competition',
                    component: () => import('@/views/marks/viewDetailCompetition.vue'),
                    meta: { requiresAuth: true, role: 'examiner' }
                },
                {
                    path: '/examiner/marks-round/:id',
                    name: 'examiner-marks-round',
                    component: () => import('@/views/marks/chamDiemTheoVong.vue'),
                    meta: { requiresAuth: true, role: 'examiner' }
                },
                {
                    path: '/previewDoc',
                    name: 'previewDoc',
                    component: () => import('@/views/doc/previewDoc.vue'),
                    meta: { requiresAuth: true, role: 'examiner' }
                }
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
            component: () => import('@/views/competitions/Form.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue')
        },
        {
            path: '/test',
            name: 'state-pinia',
            component: () => import('@/views/doc/statePinia.vue')
        }
    ],
    scrollBehavior() {
        window.scrollTo(0, 0);
    }
});

router.beforeEach((to, from, next) => {
    // console.log('to', to.meta.role);
    // chuyển đến trang login nếu chưa được login
    const publicPages = ['login', 'register', 'form', 'thanks'];
    //log result /form/2c9e50a5-9128-4a37-a216-e77595f2442a
    // const authRequired = !publicPages.includes(to.name);
    const loggedIn = JSON.parse(localStorage.getItem('user'));

    if (to.meta?.requiresAuth && !loggedIn) {
        router.push({ path: '/login' });
    }
    // console.log('role user', loggedIn.role);
    // console.log('role path', to.meta?.role);
    // if (loggedIn.role != to.meta?.role) {
    //     router.push({ path: '/login' });
    // }
    return next();
});
export default router;
