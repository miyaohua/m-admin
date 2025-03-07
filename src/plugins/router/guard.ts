import { Router } from "vue-router"
import { getAccessToken, getRouteInfo, GlobalTitle } from "./configMethod";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from "ant-design-vue";

let hasGetUserInfo = false;

// 白名单列表
const url = {
    "登录页": "/login",
    "注册页": "/registry",
    "忘记密码": "/forgotpassword",
    "首页": "/",
    "小程序": "/program",
    "工具类": "/tool",
    "赞助商家": "/sponsor",
}
const whileList = Object.values(url)

export const guard = (router: Router) => {
    // 路由加载前的一些操作
    router.beforeEach(async (to, _from, next) => {
        NProgress.start()
        GlobalTitle(to);
        if (getAccessToken()) {
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
                hasGetUserInfo = false;
                return next({ path: '/login' })
            }
        }
        next()
    })

    router.afterEach(() => {
        // 路由加载后的一些操作
        NProgress.done()
    })

    router.onError(() => {
        NProgress.done()
    })
}