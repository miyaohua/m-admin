import { defineStore } from "pinia";
import { ref } from 'vue'

interface navbarItem {
    title: string,
    route: string
}

const defaultNavBar = {
    title: '仪表盘',
    route: 'dashboard'
}

export const useNavBarStore = defineStore('navbar',
    () => {

        // 后台navbar
        const navBars = ref([defaultNavBar])

        // 设置后台navbar
        const setNavBars = (routeInfo: navbarItem) => {
            if (!navBars.value.filter(item => item.title == routeInfo.title).length) {
                navBars.value.push(routeInfo)
            }
        }

        // 清空后台navbar
        const clearNavBars = () => {
            navBars.value = [defaultNavBar]
        }

        return {
            navBars,
            setNavBars,
            clearNavBars
        }
    },
    {
        persist: true
    })