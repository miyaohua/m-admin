import { App } from 'vue'
import * as VueRouter from 'vue-router'
import routes from './route'
import { guard } from './guard'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

guard(router)


const setup = (app: App) => {
    app.use(router)
}

export { setup }

export default router