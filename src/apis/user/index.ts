import { postApi } from "@/utils/request";


/**
 * 分页获取用户
 * @param data 
 * @returns 
 */
export const getAllUserApi = (data: any) => {
    return postApi('/user/getAllUser', data)
}


/**
 * 批量删除用户
 * @param data 
 */
export const delUserApi = (data: any) => {
    return postApi('/user/delUser', data)
}


/**
 * 修改用户状态
 * @param data 
 * @returns 
 */
export const changeUserStatusApi = (data: any) => {
    return postApi('/user/changeUserStatus', data)
}


/**
 * 新增用户
 * @param data 
 */
export const addUserApi = (data: any) => {
    return postApi('/user/addUser', data)
}

/**
 * 新增用户
 * @param data 
 */
export const editUserApi = (data: any) => {
    return postApi('/user/editUser', data)
}