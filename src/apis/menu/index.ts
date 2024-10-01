import { postApi } from "@/utils/request.ts";

/**
 * 获取所有菜单
 * @param data
 */
export const menuByNumApi = (data: any) => {
    return postApi('/menu/menuByNum', data)
}


/**
 * 删除菜单
 * @param data 
 * @returns 
 */
export const delMenuApi = (data: any) => {
    return postApi('/menu/delMenu', data)
}

/**
 * 新增菜单
 * @param data 
 * @returns 
 */
export const addMenuApi = (data: any) => {
    return postApi('/menu', data)
}