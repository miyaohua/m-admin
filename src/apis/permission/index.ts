import {postApi} from "@/utils/request.ts";

/**
 * 获取所有权限
 * @param data
 */
export const getPermissionsApi = (data: any) => {
    return postApi('/permission/getPermissions', data)
}


/**
 * 为角色分配权限
 * @param data
 */
export const distributionPermissionApi = (data: any) => {
    return postApi('/permission/distributionPermission', data)
}
