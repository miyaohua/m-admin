// 默认静态路由
export default [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/',
        component: () => import('@/layouts/auth/index.vue'),
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/auth/login.vue'),
                meta: {
                    title: '登录'
                }
            }
        ]
    },
    {
        path: '/',
        component: () => import('@/layouts/home/index.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/home/dashboard/index.vue'),
                meta: {
                    title: '仪表盘'
                }
            }
        ]
    },
    {
        path: '/',
        name: 'mentDynamicRouting',
        component: () => import('@/layouts/home/index.vue'),
    },
    {
        name: 'notFound',
        path: '/:catchAll(.*)',
        component: () => import(`@/views/error/notFound.vue`)
    }
]