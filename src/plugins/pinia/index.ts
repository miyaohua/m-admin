import { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

const setup = (app: App) => {
    app.use(pinia)
}

export { setup }