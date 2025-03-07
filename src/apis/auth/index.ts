import { postApi } from "@/utils/request";


/**
 * 用户登录
 * @param url 
 * @param data 
 * @returns 
 */
export const loginApi = (data: any) => {
    return postApi('/user/login', data)
}


/**
 * 获取登录图片验证码
 * @returns 
 */
export const getPicCodeApi = () => {
    return postApi('/user/getPicCode', {})
}


/**
 * 发送邮箱验证码
 * @param data 
 * @returns 
 */
export const userRegistrySendEmailApi = (data: any) => {
    return postApi('/user/registrySendEmail', data)
}


/**
 * 注册用户
 * @param data 
 * @returns 
 */
export const registryApi = (data: any) => {
    return postApi('/user/registry', data)
}


/**
 * 重置密码发送验证码
 * @param data 
 * @returns 
 */
export const forgotPasswordSendEmailApi = (data: any) => {
    return postApi('/user/forgotPasswordSendEmail', data)
}

/**
 * 重置密码
 * @param data 
 * @returns 
 */
export const forgotPasswordApi = (data: any) => {
    return postApi('/user/forgotPassword', data)
}