import { getFlatRoute } from '@/apis/route'
import Cookies from "js-cookie";
const appName = import.meta.env.VITE_APP_NAME

/**
 * 是否登录成功
 */
export const getAccessToken = (): boolean => {
    return Cookies.get('token')
}

/**
 * 获取动态路由信息
 * @returns 
 */
export const getRouteInfo = () => {
    return new Promise(async (resolve) => {
        try {
            const res: any = await getFlatRoute()
            if (res?.code == 200) {
                // 请求接口获取route信息
                const CInfo = res.data.filter((v: any) => v.menuType == 'C')
                const routeInfo = CInfo.map((r: any) => {
                    return {
                        path: r.path,
                        name: r.name,
                        component: () => import(`../../views/home/${r.component}/index.vue`),
                        meta: {
                            title: r.name
                        }
                    }
                })
                resolve(routeInfo)
            } else {
                resolve([])
            }
        } catch (error) {
            resolve([])
        }
    })
}


/**
 * 
 * @param to 
 */
export const GlobalTitle = (to: any) => {
    document.title = `${to.meta.title} - ${appName}`
}