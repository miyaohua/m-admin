import { Router } from "vue-router"
import { getAccessToken, getRouteInfo, GlobalTitle } from "./configMethod";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from "ant-design-vue";

let hasGetUserInfo = false;

// 白名单列表
const whileList = ['/login']
export const guard = (router: Router) => {
    // 路由加载前的一些操作
    router.beforeEach(async (to, from, next) => {
        NProgress.start()
        GlobalTitle(to);
        if (getAccessToken()) {
            if (to.path == '/login') {
                return next({ path: '/dashboard' })
            }
            // 不刷新不会重置，则不会重复添加路由
            if (!hasGetUserInfo) {
                const routeInfo: any = await getRouteInfo()
                // 已存在的路由
                const haveRoute = router.getRoutes().map(v => v.name)
                routeInfo.forEach((item: any) => {
                    if (!haveRoute.includes(item.name)) {
                        router.addRoute('mentDynamicRouting', item)
                    }
                })
                hasGetUserInfo = true;
                return next(to.path)
            }
        } else {
            if (!whileList.includes(to.path)) {
                message.error('登录已过期！');
                return next({ path: '/login' })
            }
        }
        next()
    })

    router.afterEach(() => {
        // 路由加载后的一些操作
        NProgress.done()
    })

    router.onError((error: any) => {
        NProgress.done()
    })
}