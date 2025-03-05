<template>
    <a-modal okText="确认" centered cancelText="取消" v-model:open="open" :title="(isKey == 'update' ? '更新' : '新增') + `权限`"
        @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
        <a-form ref="formRef" class="mt-5" layout="horizontal" :model="formState" :label-col="{
            style: {
                width: '100px',
            },
        }">
            <a-form-item name="name" label="权限名称" :rules="[
                {
                    required: true,
                    message: '请输入权限组名称',
                    trigger: ['change', 'blur'],
                },
            ]">
                <a-input v-model:value="formState.name" placeholder="示例：新增菜单" />
            </a-form-item>

            <a-form-item name="identifying" label="权限标识" :rules="[
                {
                    required: true,
                    message: '请输入权限标识',
                    trigger: ['change', 'blur'],
                },
            ]">
                <a-input v-model:value="formState.identifying" placeholder="示例：create-menu" />
            </a-form-item>

            <a-form-item name="desc" label="权限描述" :rules="[
                {
                    required: true,
                    message: '请输入权限描述',
                    trigger: ['change', 'blur'],
                },
            ]">
                <a-input v-model:value="formState.desc" placeholder="示例：用户拥有新增菜单权限" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { addPermissionApi, updatePermissionApi } from "@/apis/permission";
import { message } from "ant-design-vue";
import { ref, defineEmits } from "vue";
const formRef = <any>ref(null);
const formState = <any>ref({
    name: "",
    identifying: '',
    desc: '',
});

const currentGroup = <any>ref(null)
const currentPermission = <any>ref(null)

const isKey = <any>ref(null)

const emits = defineEmits(['refreshData'])

const open = ref(false);
const openDialog = (item: any, is: any) => {
    open.value = true;
    isKey.value = is
    currentGroup.value = null;
    currentPermission.value = null;
    if (is == 'create') {
        formState.value = {}
        currentGroup.value = item
    } else if (is == 'update') {
        formState.value = {
            ...item
        }
        currentPermission.value = item
    }
};

const handleOk = () => {
    formRef.value
        .validate().then(async () => {
            if (isKey.value == 'create') {
                const res: any = await addPermissionApi({
                    ...formState.value,
                    permissionGroupId: currentGroup && currentGroup?.value.id,
                })
                if (res?.code == 200) {
                    message.success('新增成功')
                    open.value = false;
                    emits('refreshData')
                }
            } else if (isKey.value == 'update') {
                const res: any = await updatePermissionApi({
                    ...currentPermission.value,
                    ...formState.value,
                })
                if (res?.code == 200) {
                    message.success('修改成功')
                    open.value = false;
                    emits('refreshData')
                }
            }

        })
};

const handleCancel = () => {
    formRef.value.resetFields();
};

defineExpose({
    openDialog,
});
</script>

<style lang="scss" scoped></style>