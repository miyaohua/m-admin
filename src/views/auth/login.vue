<template>
    <div class="h-full w-1/1! flex justify-center">
        <div class="w-4/5 h-full md:w-2/5">
            <div class="w-full h-full pt-74">
                <div class="mb-10 text-center text-xl font-bold">{{ appName }}</div>
                <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish"
                    @finishFailed="onFinishFailed">

                    <a-form-item name="email" :rules="[{ validator: checkEmail, trigger: ['change', 'blur'] }]">
                        <a-input placeholder="请输入邮箱" v-model:value="formState.email" />
                    </a-form-item>

                    <a-form-item name="password" :rules="[{ validator: checkPass, trigger: ['change', 'blur'] }]">
                        <a-input-password placeholder="请输入密码" v-model:value="formState.password" />
                    </a-form-item>

                    <a-form-item name="code" :rules="[{ validator: checkPicode, trigger: ['change', 'blur'] }]">
                        <div class="flex justify-between h-8">
                            <a-input class="w-9/12" placeholder="请输入图片验证码" v-model:value="formState.code" />
                            <div class="w-3/12 cursor-pointer flex justify-end" @click="getPicCode" v-html="picImg">
                            </div>
                        </div>
                    </a-form-item>

                    <a-form-item name="remember">
                        <div class="flex justify-between">
                            <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
                            <div class="forget" @click="forgotPassword">忘记密码?</div>
                        </div>
                    </a-form-item>

                    <div>
                        <a-button :size="globalSizeStore.globalSize" class="w-full h-full" type="primary"
                            html-type="submit">登录</a-button>
                    </div>
                    <div class="mt-4 h-8 leading-9">还没有创建账号? <a href="#/registry">创建新账号</a></div>
                </a-form>
                <a-divider plain>其他登录方式</a-divider>
                <div class="flex justify-center">
                    <!-- 微信 -->
                    <svg @click="jumpLogin('wechat')" t="1721178508955" class="icon cursor-pointer"
                        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2184" width="30"
                        height="30">
                        <path
                            d="M352.814545 385.396364m-33.512727 0a33.512727 33.512727 0 1 0 67.025455 0 33.512727 33.512727 0 1 0-67.025455 0Z"
                            fill="#50B674" p-id="2185"></path>
                        <path
                            d="M502.690909 384.465455m-33.512727 0a33.512727 33.512727 0 1 0 67.025454 0 33.512727 33.512727 0 1 0-67.025454 0Z"
                            fill="#50B674" p-id="2186"></path>
                        <path
                            d="M576.232727 534.341818m-23.272727 0a23.272727 23.272727 0 1 0 46.545455 0 23.272727 23.272727 0 1 0-46.545455 0Z"
                            fill="#50B674" p-id="2187"></path>
                        <path
                            d="M694.458182 536.203636m-23.272727 0a23.272727 23.272727 0 1 0 46.545454 0 23.272727 23.272727 0 1 0-46.545454 0Z"
                            fill="#50B674" p-id="2188"></path>
                        <path
                            d="M512 0C229.003636 0 0 229.003636 0 512s229.003636 512 512 512 512-229.003636 512-512S794.996364 0 512 0z m-87.505455 630.225455c-26.996364 0-48.407273-5.585455-75.403636-11.17091l-75.403636 37.236364 21.410909-64.232727c-53.992727-37.236364-85.643636-85.643636-85.643637-145.221818 0-102.4 96.814545-182.458182 215.04-182.458182 105.192727 0 198.283636 64.232727 216.901819 150.807273-6.516364-0.930909-13.963636-0.930909-20.48-0.93091-102.4 0-182.458182 76.334545-182.458182 170.356364 0 15.825455 2.792727 30.72 6.516363 44.683636-7.447273 0-13.963636 0.930909-20.48 0.93091z m314.647273 75.403636l15.825455 53.992727-58.647273-32.581818c-21.410909 5.585455-42.821818 11.170909-64.232727 11.170909-102.4 0-182.458182-69.818182-182.458182-155.461818s80.058182-155.461818 182.458182-155.461818c96.814545 0 182.458182 69.818182 182.458182 155.461818 0 47.476364-31.650909 90.298182-75.403637 122.88z"
                            fill="#50B674" p-id="2189"></path>
                    </svg>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME
import { message } from 'ant-design-vue';
import { reactive, onMounted, ref } from 'vue';
import { loginApi, getPicCodeApi } from '@/apis/auth'
import Cookie from 'js-cookie'
import { useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form';
import { emailReg, passReg, picCodeReg } from '@/utils/reg'
import { useGlobalSizeStore } from '@/store/globalSize'

const globalSizeStore = useGlobalSizeStore()

const router = useRouter();
interface FormState {
    email: string;
    password: string;
    code: string,
    remember: boolean;
}

const formState = reactive<FormState>({
    email: '2542571191@qq.com',
    password: 'mi010409',
    code: '',
    remember: true,
});

let picUUIDCode = ref('')
let picImg = ref('')

onMounted(() => {
    getPicCode()
})

// 校验邮箱
const checkEmail = async (_rule: Rule, value: string) => {
    const flag = emailReg.test(value)
    if (!value) {
        return Promise.reject('请输入邮箱')
    } else if (!flag) {
        return Promise.reject('请输入合法的邮箱')
    }
};

// 校验密码
const checkPass = async (_rule: Rule, value: string) => {
    const flag = passReg.test(value)
    if (!value) {
        return Promise.reject('请输入密码')
    } else if (!flag) {
        return Promise.reject('请输入6-20位字符,(字母、‌数字、‌特殊字符)至少包含两种字符类型')
    }
}

// 校验图片验证码
const checkPicode = async (_rule: Rule, value: string) => {
    const flag = picCodeReg.test(value)
    if (!value) {
        return Promise.reject('请输入验证码')
    } else if (!flag) {
        return Promise.reject('请输入4位字符的验证码')
    }
}


// 获取图片验证码
const getPicCode = async () => {
    const res: any = await getPicCodeApi()
    if (res?.code == 200) {
        picUUIDCode.value = res.data.uuid
        picImg.value = res.data.img
    }
}





/**
 * 登录
 * @param values 
 */
const onFinish = async (values: any) => {
    const res: any = await loginApi({ ...values, uuid: picUUIDCode.value })
    if (res?.code == 200) {
        message.success('登录成功！')
        // 保存token 30分钟 0.5/24=0.020
        Cookie.set('token', res.data.token, { expires: 0.020 })
        router.push('/dashboard')
    } else {
        // 登录失败重置验证码图片
        getPicCode();
    }
};


/**
 * 忘记密码
 */
const forgotPassword = () => {

}

/**
 * 三方登录
 * @param key 
 */
const jumpLogin = (key: string) => {
    switch (key) {
        case 'wechat':
            console.log('微信登录')
            break;

        default:
            break;
    }
}

/**
 * 验证错误
 * @param errorInfo 
 */
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>

<style scoped lang="scss">
.forget {
    cursor: pointer;
}
</style>