<template>
    <div class="p-5 bg-white">
        <a-form ref="formRef" :model="formState" layout="inline" name="basic" autocomplete="off" @finish="onFinish">
            <a-form-item label="用户邮箱" name="email">
                <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item label="用户状态" name="status">
                <a-select allowClear v-model:value="formState.status" style="width:120px">
                    <a-select-option value="1">正常</a-select-option>
                    <a-select-option value="0">冻结</a-select-option>
                </a-select>
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
            <a-button type="primary" @click="addUser">新增用户</a-button>
            <a-button class="ml-3" danger @click="delUser">批量删除</a-button>
        </div>
        <!-- 表格 -->
        <a-table :rowSelection="rowSelection" bordered :pagination="paginationConfig" :columns="columns"
            :data-source="data" :loading="isLoading" @change="changeFn" :row-key="(record: any) => record.id">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                    <a-switch v-model:checked="record.status" @change="changeUserStatus(record)" />
                </template>

                <template v-else-if="column.key === 'role'">
                    <a-tag v-if="record.role.length" v-for="(item, index) in record.role" :key="index" :bordered="false"
                        color="processing">{{
            item.name }}</a-tag>
                    <span v-else class="fz-12 text-rose-500">暂未分配角色</span>
                </template>

                <template v-else-if="column.key === 'action'">
                    <span>
                        <a-tooltip title="修改用户">
                            <a-button @click="edit(record)" type="link">修改</a-button>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip title="删除用户">
                            <a-button type="link" @click="del(record)" danger>删除</a-button>
                        </a-tooltip>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
    <!-- 新增修改用户 -->
    <addChange ref="addChangeRef" @getData="getAllUser" />
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { getAllUserApi, delUserApi, changeUserStatusApi } from '@/apis/user'
import { useGlobalSizeStore } from '@/store/globalSize'
import { message,Modal } from 'ant-design-vue'
import addChange from './addChange.vue'

const globalSizeStore = useGlobalSizeStore();

interface FormState {
    email: string;
    status: string
}

const formRef = ref<any>(null)
const formState = reactive<FormState>({
    email: '',
    status: ''
});


onMounted(() => {
    getAllUser()
})

const getAllUser = () => {
    onFinish(formState)
}

const onFinish = async (values?: FormState) => {
    isLoading.value = true;
    const res: any = await getAllUserApi({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        ...values,
    })
    if (res?.code == 200) {
        data.value = res.data.list.map((v: any) => {
            return {
                ...v,
                role: v.roles.map((r: any) => r)
            }
        })
        total.value = res.data.total
    }
    isLoading.value = false;
}


const resetForm = () => {
    formRef.value.resetFields()
    getAllUser()
}



const pageNum = ref(1);
const pageSize = ref(5);
const total = ref(0)

const isLoading = ref<Boolean>(false)
const data: any = ref([])

const columns = ref([
    {
        title: '用户名称',
        dataIndex: 'username',
        key: 'username',
        align: "center"
    },
    {
        title: '用户邮箱',
        dataIndex: 'email',
        key: 'email',
        align: "center"
    },
    {
        title: '用户状态',
        dataIndex: 'status',
        key: 'status',
        align: "center"
    },
    {
        title: '用户角色',
        dataIndex: 'role',
        key: 'role',
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

const addUser = () => {
    addChangeRef.value.showModal(null)
}

// 分页
const changeFn = (pagination: any) => {
    console.log(pagination);
    pageNum.value = pagination.current
    pageSize.value = pagination.pageSize
    getAllUser()
}

const edit = (row: any) => {
    addChangeRef.value.showModal(row)
}


// 单个删除
const del = (row: any) => {
    Modal.confirm({
        title: '确认',
        content: '该操作将永久删除该用户',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await delUserApi({ ids: [row.id] })
            if (res?.code == 200) {
                message.success('删除成功')
                getAllUser()
            }
        }
    });
}

// 批量删除
const delUser = () => {
    if (!selectedRowKeys.value.length) {
        return message.warning('请至少选择一个用户进行删除')
    }
    Modal.confirm({
        title: '确认',
        content: '该操作将永久删除该用户',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await delUserApi({ ids: selectedRowKeys.value })
            if (res?.code == 200) {
                message.success('删除成功')
                getAllUser()
                selectedRowKeys.value = []
            }
        }
    });



}

/**
 * 修改用户状态
 * @param row 
 */
const changeUserStatus = (row: any) => {
    Modal.confirm({
        title: '确认',
        content: '该操作将修改用户状态',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await changeUserStatusApi({ status: row.status, id: row.id })
            if (res?.code == 200) {
                message.success('修改成功')
                getAllUser()
            }
        },
        onCancel() {
            row.status = !row.status
        }
    });

}


const addChangeRef = ref<any>(null)


</script>


<style scoped lang="scss">
.fz-12 {
    font-size: 12px;
}
</style>