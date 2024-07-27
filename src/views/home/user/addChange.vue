<template>
    <a-modal okText="确认" cancelText="取消" centered v-model:open="open" :title="editId ? '修改用户' : '新增用户'" @ok="handleOk">
        <a-form ref="formRef" class="mt-5" layout="horizontal" :model="formState" :label-col="{
        style: {
            width: '80px'
        }
    }">
            <a-form-item name="username" label="用户名称">
                <a-input v-model:value="formState.username" placeholder="请输入用户名称" />
            </a-form-item>

            <a-form-item name="email" label="邮箱" :rules="[{ validator: checkEmail, trigger: ['change', 'blur'] }]">
                <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
            </a-form-item>

            <a-form-item name="password" label="密码" :rules="[{ validator: checkPass, trigger: ['change', 'blur'] }]">
                <a-input-password v-model:value="formState.password" :placeholder="editId ? '为空则不修改密码' : '请输入密码'" />
            </a-form-item>

            <a-form-item name="roles" label="分配角色">
                <a-select v-model:value="formState['roles']" mode="multiple" placeholder="请选择角色">
                    <a-select-option v-for="(item, index) in roles" :key="index" :value="item.id" :label="item.name">{{
        item.name }}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, UnwrapRef } from 'vue'
import { addUserApi, editUserApi, getRoleApi } from '@/apis/user'
import { emailReg, passReg } from '@/utils/reg';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
let open = ref(false)
let editId = ref(null)
let roles = ref<any>([])
const emit = defineEmits(['getData'])

const showModal = async (value: any) => {
    open.value = true;
    const res: any = await getRoleApi()
    if (res?.code == 200) {
        roles.value = res.data
    }
    nextTick(() => {
        formRef.value.clearValidate()
        if (!value) {
            formState.username = ''
            formState.email = ''
            formState.password = ''
            formState.roles = []
            editId.value = null
        } else {
            formState.username = value.username
            formState.email = value.email
            formState.password = ''
            formState.roles = value.roles.map((v: any) => v.id)
            editId.value = value.id
        }

    })
}

const handleOk = async () => {
    if (editId.value) {
        // 修改
        const res: any = await editUserApi({ ...formState, id: editId.value })
        if (res?.code == 200) {
            message.success('修改成功')
            open.value = false;
            emit('getData')
        }
    } else {
        // 新增
        const res: any = await addUserApi(formState)
        if (res?.code == 200) {
            message.success('新增成功')
            open.value = false;
            emit('getData')
        }
    }
}


interface FormState {
    username: string | null,
    email: string,
    password: string,
    roles: Array<number>
}

const formState: UnwrapRef<FormState> = reactive({
    username: '',
    email: '',
    password: '',
    roles: []
});

const formRef = ref<any>(null)

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
    if (!editId.value) {
        const flag = passReg.test(value)
        if (!value) {
            return Promise.reject('请输入密码')
        } else if (!flag) {
            return Promise.reject('请输入6-20位字符,(字母、‌数字、‌特殊字符)至少包含两种字符类型')
        }
    }
}

defineExpose({
    showModal
})

</script>

<style scoped lang="scss"></style>