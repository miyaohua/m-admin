<template>
    <div>
        <a-card :loading="loading" title="个人信息">
            <a-alert class="alert" show-icon message="用户角色如未更新，请退出账号后重新登录。" type="warning" />
            <div class="line">用户名称：<a-tag color="blue">{{userInfo.username || '未设置'}}</a-tag></div>
            <div class="line">用户角色：<a-tag v-for="(item,index) in userInfo.roles" :key="index" color="blue">{{item}}</a-tag></div>
            <div class="line">用户邮箱：<a-tag color="blue">{{userInfo.email || '未设置'}}</a-tag></div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { getUserInfoApi } from '@/apis/user';
import { onMounted,ref } from 'vue'

const loading = ref(true)
const userInfo = <any>ref({})

onMounted(()=>{
    getUserInfo()
})

const getUserInfo = async () =>{
    const res :any = await getUserInfoApi()
    if(res?.code == 200){
        loading.value = false;
        userInfo.value = res.data
    }

}
</script>


<style scoped lang='scss'>
.alert{
    margin-bottom:20px;
}

.line{
    margin-bottom:20px;
    margin-left: 5px;
}

</style>