<template>
    <a-modal centered v-model:open="open" title="分配菜单" cancel-text="取消" ok-text="确认" @ok="handleOk">
        <a-tree draggable checkStrictly v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys" checkable
            :tree-data="treeData" :field-names="fieldNames">
        </a-tree>
    </a-modal>
</template>


<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { TreeProps } from 'ant-design-vue';
import { getRoute } from '@/apis/route'
import { allMenuApi, allocationMenuApi } from '@/apis/role'
import { message } from 'ant-design-vue'

const open = ref<boolean>(false)


// 选中的数节点
let checkedKeys = ref<any>([])

// 节点数据
let treeData = ref([])

let expandedKeys = ref([])

const fieldNames: TreeProps['fieldNames'] = {
    title: 'name',
    key: 'id'
};

// 当前行值
let recordV = ref<any>({})


const showModal = (record: any) => {
    open.value = true
    nextTick(async () => {
        recordV.value = record
        const res: any = await allMenuApi()
        if (res?.code == 200) {
            treeData.value = res.data
            setTimeout(() => {
                checkedKeys.value = record.menus.map((v: any) => v.id)
                expandedKeys.value = record.menus.map((v: any) => v.id)
            }, 0);
        }
    })
}

const handleOk = async () => {
    console.log(recordV)
    const res: any = await allocationMenuApi({
        roleId: recordV.value.id,
        menuIds: checkedKeys.value.checked ? checkedKeys.value.checked : checkedKeys.value
    })
    if (res?.code == 200) {
        message.success('分配菜单成功')
        open.value = false
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }
}


defineExpose({
    showModal
})

</script>