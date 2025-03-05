import { postApi } from "@/utils/request.ts";

/**
 * 获取所有权限
 * @param data
 */
export const getPermissionsApi = () => {
    return postApi('/permission/getPermissions', {})
}


/**
 * 为角色分配权限
 * @param data
 */
export const distributionPermissionApi = (data: any) => {
    return postApi('/permission/distributionPermission', data)
}


/**
 * 新增权限组
 * @param data 
 * @returns 
 */
export const addPermissionGroupApi = (data: any) => {
    return postApi('/permission/addPermissionGroup', data)
}


/**
 * 删除权限组
 * @param data 
 * @returns 
 */
export const delPermissionGroupApi = (data: any) => {
    return postApi('/permission/delPermissionGroup', data)
}


/**
 * 更新权限组
 * @param data 
 * @returns 
 */
export const updatePermissionGroupApi = (data: any) => {
    return postApi('/permission/updatePermissionGroup', data)
}


/**
 * 新增权限
 * @param data 
 * @returns 
 */
export const addPermissionApi = (data: any) => {
    return postApi('/permission/addPermission', data)
}


/**
 * 更新权限
 * @param data 
 * @returns 
 */
export const updatePermissionApi = (data: any) => {
    return postApi('/permission/updatePermission', data)
}


/**
 * 删除权限
 * @param data 
 * @returns 
 */
export const delPermissionApi = (data: any) => {
    return postApi('/permission/delPermission', data)
}