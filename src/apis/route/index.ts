import { getApi, postApi } from "@/utils/request";


/**
 * 获取菜单
 * @returns 
 */
export const getRoute = () => {
    return getApi('/menu')
}

/**
 * 获取扁平化菜单
 * @returns 
 */
export const getFlatRoute = () => {
    return postApi('/menu/flatMenu', {})
}