<template>
    <div class="p-5 bg-white">
        <a-form ref="formRef" :model="formState" layout="inline" name="basic" autocomplete="off" @finish="onFinish">
            <a-form-item label="角色名称" name="name">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit">查询</a-button>
                <a-button class="ml-4" @click="resetForm">重置</a-button>
            </a-form-item>
        </a-form>
    </div>

    <div class="p-5 bg-white mt-5">
        <!-- 操作按钮 -->
        <div class="mb-5">
            <a-button type="primary" @click="addRole">新增角色</a-button>
            <a-button class="ml-3" danger @click="delRole">批量删除</a-button>
        </div>
        <!-- 表格 -->
        <a-table :rowSelection="rowSelection" bordered :pagination="paginationConfig" :columns="columns"
            :data-source="data" :loading="isLoading" @change="changeFn" :row-key="(record: any) => record.id">
            <template #expandedRowRender="{ record }">
                <div v-for="(item, index) in record.permissionGroups" :key="index">
                    {{ item.name }}
                </div>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a-tooltip title="修改角色">
                            <a-button @click="edit(record)" type="link">修改</a-button>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip title="删除角色">
                            <a-button type="link" @click="del(record)" danger>删除</a-button>
                        </a-tooltip>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { getAllRoleApi, delAllRoleApi } from '@/apis/role'
import { message, Modal } from 'ant-design-vue'


interface FormState {
    name: string;
}
const formRef = ref<any>(null)
const formState = reactive<FormState>({
    name: '',
});


onMounted(() => {
    getAllRole()
})

const getAllRole = () => {
    onFinish(formState)
}
const onFinish = async (values?: FormState) => {
    console.log(values)
    const res: any = await getAllRoleApi({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        values
    })
    if (res?.code == 200) {
        data.value = res.data.list
        total.value = res.data.total
    }
}

const resetForm = () => {
    formRef.value.resetFields()
    getAllRole()
}




const pageNum = ref(1);
const pageSize = ref(5);
const total = ref(0)
const data: any = ref([])

const isLoading = ref<Boolean>(false)


const columns = ref([
    {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        align: "center"
    },
    {
        title: '角色描述',
        dataIndex: 'desc',
        key: 'desc',
        align: "center"
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: "center"
    },
    {
        title: '修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: "center"
    },
    {
        title: '操作',
        key: 'action',
        align: "center"
    },
])

const selectedRowKeys = ref([]);
const rowSelection = reactive({
    selectedRowKeys,
    onChange: (newSelectedRowKeys: any) => {
        selectedRowKeys.value = newSelectedRowKeys;
    }
});


const paginationConfig = ref({
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    current: pageNum,
    pageSize,
    total: total,
    showSizeChanger: true,
    showTotal: (total: number) => `总 ${total} 条数据`,
})


// 分页
const changeFn = (pagination: any) => {
    console.log(pagination);
    pageNum.value = pagination.current
    pageSize.value = pagination.pageSize
    getAllRole()
}


const edit = (record: any) => {
    console.log(record)
}

/**
 * 删除单个角色
 * @param record 
 */
const del = async (record: any) => {
    const { id } = record
    Modal.confirm({
        title: '确认',
        content: '该操作将永久删除该角色',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await delAllRoleApi({
                ids: [id]
            })
            if (res?.code == 200) {
                message.success('删除成功')
                getAllRole()
            }
        }
    });

}

/**
 * 批量删除角色
 */
const delRole = () => {
    if (!selectedRowKeys.value.length) {
        return message.warning('请至少选择一个角色进行删除')
    }
    Modal.confirm({
        title: '确认',
        content: '该操作将永久删除该角色',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await delAllRoleApi({ ids: selectedRowKeys.value })
            if (res?.code == 200) {
                message.success('删除成功')
                getAllRole()
                selectedRowKeys.value = []
            }
        }
    });
}

const addRole = () => {
    console.log('addRole')
}

</script>


<style scoped lang="scss"></style>
