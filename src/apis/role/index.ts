import { getApi, postApi } from "@/utils/request";


/**
 * 分页获取角色列表
 * @param data 
 * @returns 
 */
export const getAllRoleApi = (data: any) => {
    return postApi('/role/getAllRole', data)
}


/**
 * 批量删除角色
 * @param data 
 * @returns 
 */
export const delAllRoleApi = (data: any) => {
    return postApi('/role/delRole', data)
}


/**
 * 新增角色
 * @param data
 */
export const addRoleApi = (data: any) => {
    return postApi('/role/addRole', data)
}


/**
 * 修改角色
 * @param data
 */
export const editRoleApi = (data: any) => {
    return postApi('/role/editRole', data)
}


/**
 * 分配菜单
 * @param data 
 * @returns 
 */
export const allocationMenuApi = (data: any) => {
    return postApi('/menu/allocationMenu', data)
}


/**
 * 获取所有菜单
 * @returns 
 */
export const allMenuApi = () => {
    return getApi('/menu/allMenu')
}