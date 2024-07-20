import { App } from 'vue'
import { setup as router } from './router'
import { setup as pinia } from './pinia'
import { setup as tailwind } from './tailwind'
import { setup as antdv } from './antdv'

const modules = [router, pinia, tailwind, antdv]

// 统一注册插件
const usePlugins = (app: App) => {
    modules.map(setup => setup(app))
}

export default usePlugins;