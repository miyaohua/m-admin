<template>
  <a-modal okText="确认" cancelText="取消" centered v-model:open="open" :title="editId ? '修改角色' : '新增角色'"
           @ok="handleOk">
    <a-form ref="formRef" class="mt-5" layout="horizontal" :model="formState" :label-col="{
        style: {
            width: '80px'
        }
    }">
      <a-form-item name="name" label="角色名称"
                   :rules="[{ required:true,message:'请输入角色名称', trigger: ['change', 'blur'] }]">
        <a-input v-model:value="formState.name" placeholder="请输入角色名称"/>
      </a-form-item>

      <a-form-item name="desc" label="角色描述"
                   :rules="[{ required:true,message:'请输入角色描述', trigger: ['change', 'blur'] }]">
        <a-input v-model:value="formState.desc" placeholder="请输入角色描述"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref} from "vue";
import {addRoleApi, editRoleApi} from '@/apis/role'
import {message} from "ant-design-vue";
const emits = defineEmits(['getData'])

interface FormState {
  name: string
  desc: string
}

const formState = reactive<FormState>({
  name: '',
  desc: ''
})

const formRef = ref<any>(null)

let open = ref<boolean>(false)

let editId = ref<string>('')

const showModal = (item: any | null) => {
  open.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
    if (item && Object.keys(item).length) {
      editId.value = item.id
      formState.name = item.name
      formState.desc = item.desc
      return;
    } else {
      editId.value = ''
      formState.name = ''
      formState.desc = ''
    }
  })

}

const handleOk = () => {
  formRef.value.validate().then(async (valid: any) => {
    if (valid) {
      if (editId.value) {
        const res: any = await editRoleApi({
          id: editId.value?.toString() || '',
          ...formState
        })
        if (res?.code == 200) {
          open.value = false;
          message.success('修改成功')
          emits('getData')
        }
        return;
      }
      const res: any = await addRoleApi(formState)
      if (res?.code == 200) {
        open.value = false;
        message.success('新增成功')
        emits('getData')
      }
    }
  })

}

defineExpose({
  showModal
})

</script>

<style scoped lang="scss">

</style>