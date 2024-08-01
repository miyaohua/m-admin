import { postApi } from "@/utils/request";


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