<template>
    <div class="h-full w-1/1! flex justify-center">
      <div class="w-4/5 h-full md:w-2/5">
        <div class="w-full h-full pt-55">
          <div class="mb-10 text-center text-xl font-bold">{{ appName }} - 忘记密码</div>
          <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
  
            <a-form-item name="email" :rules="[{ validator: checkEmail, trigger: ['change', 'blur'] }]">
              <a-input placeholder="请输入邮箱" v-model:value="formState.email" />
            </a-form-item>
  
            <a-form-item name="password" :rules="[{ validator: checkPass, trigger: ['change', 'blur'] }]">
              <a-input-password placeholder="请输入密码" v-model:value="formState.password" />
            </a-form-item>
  
            <a-form-item name="code" :rules="[{ validator: checkEmailcode, trigger: ['change', 'blur'] }]">
              <div class="flex justify-between h-8">
                <a-input class="w-9/12" placeholder="请输入邮箱验证码" v-model:value="formState.code" />
                <a-button type="primary" @click="getCode" :loading="isLoading">{{isLoading ? codeReset + 's' : '获取验证码'}}</a-button>
              </div>
            </a-form-item>
  
            <div>
              <a-button class="w-full h-full" type="primary" html-type="submit">重置密码</a-button>
            </div>
            <div class="mt-4 h-8 leading-9">已有账号？<a @click="router.push('/login')">去登录</a></div>
          </a-form>
        </div>
      </div>
  
  
    </div>
  </template>
  
  <script setup lang="ts">
  const appName = import.meta.env.VITE_APP_NAME
  import { message } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router'
  import type { Rule } from 'ant-design-vue/es/form';
  import { emailReg, passReg,emailCodeReg } from '@/utils/reg'
  import { forgotPasswordApi, forgotPasswordSendEmailApi } from '@/apis/auth'
  
  
  const router = useRouter();
  
  interface FormState {
    email: string;
    password: string;
    code: string,
  }
  
  const formState = reactive<FormState>({
    email: '',
    password: '',
    code: '',
  });
  
  
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
  const checkEmailcode = async (_rule: Rule, value: string) => {
    const flag = emailCodeReg.test(value)
    if (!value) {
      return Promise.reject('请输入验证码')
    } else if (!flag) {
      return Promise.reject('请输入6位字符的验证码')
    }
  }
  const isLoading = ref(false)
  const codeReset = ref(60)

  /**
   * 获取邮箱验证码
   */
  const getCode = async () =>{
    const flag = emailReg.test(formState.email)
    if (!formState.email) {
      return message.error('请输入邮箱')
    } else if (!flag) {
      return message.error('请输入合法的邮箱')
    }
    const res:any = await forgotPasswordSendEmailApi({
        email:formState.email
    })
    if(res?.code == 200){
        isLoading.value = true;
        codeReset.value = 60;
        message.success(`邮箱已发送到${formState.email}，5分钟内有效`)
        setInterval(()=>{
            codeReset.value--;
            if(codeReset.value <= 0){
                isLoading.value = false;
                codeReset.value = 60;
            }
        },1000)
    }
  }
  
  
  /**
   * 重置
   * @param values
   */
  const onFinish = async (values: any) => {
    const res:any = await forgotPasswordApi(values)
    if(res?.code == 200){
        message.success('重置密码成功')
        setTimeout(() => {
        router.push('/login')
      }, 500)
    }
  };
  

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