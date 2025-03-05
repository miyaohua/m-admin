<template>
  <a-modal okText="确认" centered cancelText="取消" v-model:open="open" :title="(isUpdate ? '更新' : '新增') + `权限分组`"
    @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <a-form ref="formRef" class="mt-5" layout="horizontal" :model="formState" :label-col="{
      style: {
        width: '100px',
      },
    }">
      <a-form-item name="name" label="权限组名称" :rules="[
        {
          required: true,
          message: '请输入权限组名称',
          trigger: ['change', 'blur'],
        },
      ]">
        <a-input v-model:value="formState.name" placeholder="示例：菜单权限" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { addPermissionGroupApi, updatePermissionGroupApi } from '@/apis/permission'
import { message } from "ant-design-vue";
const formRef = <any>ref(null);
const formState = <any>ref({
  name: "",
});

const isUpdate = ref(false)
const updateInfo = <any>ref(null)

const emits = defineEmits(['refreshData'])

const open = ref(false);
const openDialog = (item: any) => {
  if (item) {
    isUpdate.value = true;
    updateInfo.value = item
    formState.value.name = item.name
  } else {
    isUpdate.value = false;
    updateInfo.value = null
    formState.value.name = '';
  }
  open.value = true;
};

const handleOk = () => {
  formRef.value
    .validate().then(async () => {
      if (isUpdate.value) {
        const res: any = await updatePermissionGroupApi({
          id: updateInfo && updateInfo?.value.id,
          name: formState.value.name,
        })
        if (res?.code == 200) {
          message.success('更新成功')
          formRef.value.resetFields();
          open.value = false;
          emits('refreshData')
        }
      } else {
        const res: any = await addPermissionGroupApi({
          permissionGroupName: formState.value.name
        })
        if (res?.code == 200) {
          message.success('新增成功')
          formRef.value.resetFields();
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
