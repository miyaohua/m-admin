<template>
  <a-modal centered v-model:open="open" title="分配权限" cancel-text="取消" ok-text="确认" @ok="handleOk">
    <a-alert class="mb-2 mt-4" message="温馨提示：重新分配权限后，需要用户重新登录才可以生效！" type="warning" />
    <div class="max-h-130 overflow-y-auto">
      <a-collapse v-model:activeKey="activeKey" :bordered="false" ghost>
        <a-collapse-panel v-for="item in permissionGroups" :key="item.id" :header="item.name">
          <span class="ml-1.5" v-for="(permission, index) in item.permissions" :key="index">
            <a-checkbox v-model:checked="permission.check">{{ permission.name }}</a-checkbox>
          </span>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { getPermissionsApi, distributionPermissionApi } from "@/apis/permission";
import { message } from "ant-design-vue";

const emits = defineEmits(['getData'])

const open = ref(false)

// 当前角色拥有的权限
const rolePermissions = ref([])

// 所有组信息
const permissionGroups = ref<any>([])

// 选中的tab
const activeKey = ref([])

// 角色id
const roleId = ref('');

const getPermissions = async () => {
  const res: any = await getPermissionsApi({})
  if (res?.code == 200) {
    activeKey.value = res.data.map((v: any) => v.id)
    res.data.forEach((v: any) => {
      v.permissions.forEach((r: any) => {
        r.check = !!rolePermissions.value.find((permission: any) => permission.id === r.id);
      })
    })
    permissionGroups.value = res.data
  } else {
    open.value = false;
  }
}


const showModal = (record: any) => {
  open.value = true
  roleId.value = record.id;
  console.log(record)
  nextTick(() => {
    rolePermissions.value = record.permissions
    getPermissions()
  })
}

const handleOk = async () => {
  // 获取所有选中的 更新状态
  const newPermission = permissionGroups.value.map((v: any) => {
    return v.permissions.filter((r: any) => {
      return r.check
    })
  }).flat()
  const res: any = await distributionPermissionApi({
    roleId: roleId.value,
    permissions: newPermission,
  })
  if (res?.code == 200) {
    message.success('权限分配成功')
    open.value = false;
    emits('getData')
  }
}

defineExpose({
  showModal
})

</script>

<style scoped lang="scss">
:deep(.ant-collapse-header) {
  padding: 12px 0 !important;
}

:deep(.ant-collapse-content-box) {
  padding: 12px 0 !important;
}

:deep(.ant-collapse-borderless) {
  background-color: #fff !important;
}
</style>