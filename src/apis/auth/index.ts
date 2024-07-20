import { getApi, postApi } from "@/utils/request";


/**
 * 用户登录
 * @param url 
 * @param data 
 * @returns 
 */
export const loginApi = (data: any) => {
    return postApi('/user/login', data)
}


export const getPicCodeApi = () => {
    return postApi('/user/getPicCode', {})
}