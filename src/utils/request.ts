import axios from 'axios'
import { message } from 'ant-design-vue';
import router from '@/plugins/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const http = axios.create({
    baseURL: import.meta.env.VITE_API,
    timeout: 60000,
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    NProgress.start()
    // 在发送请求之前做些什么

    if (window.localStorage.getItem('token')) {
        config.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    NProgress.done()
    // 业务代码异常提示
    if (response.data.code !== 200) {
        message.error(response.data.message);
    }
    // 对响应数据做点什么    
    return response.data;
}, function (error) {
    switch (error?.response?.status) {
        case 403:
            message.error('暂无权限，请稍后再试！');
            break;
        case 401:
            window.localStorage.removeItem('token')
            setTimeout(() => {
                router.push({ path: '/login' })
            }, 1000)
            break;
        case 500:
            message.error('请求失败，请稍后再试！');
            break;
        default:
            message.error(error?.response?.data?.message || '请求失败，请稍后再试！');
            break;
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default http


/**
 * get请求
 * @param url 
 * @param param
 * @returns 
 */
const getApi = (url: string, params?: any) => {
    return http.get(url, { params })
}

/**
 * post请求
 * @param url 
 * @param data 
 * @returns 
 */
const postApi = (url: string, data: any) => {
    return http.post(url, data)
}

/**
 * patch请求
 * @param url 
 * @param data 
 * @returns 
 */
const patchApi = (url: string, data: any) => {
    return http.patch(url, data)
}


/**
 * delete请求
 * @param url 
 * @param data 
 * @returns 
 */
const deleteApi = (url: string) => {
    return http.delete(url)
}

export { getApi, postApi, patchApi, deleteApi }
