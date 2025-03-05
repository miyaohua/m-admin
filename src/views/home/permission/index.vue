<template>
    <div class="p-5 bg-white">
        <a-form ref="formRef" :model="formState" layout="inline" name="basic" autocomplete="off" @finish="onFinish">
            <a-form-item label="权限组名称" name="name">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item label=" " :colon="false">
                <a-button type="primary" html-type="submit">查询</a-button>
                <a-button class="ml-4" @click="resetForm">重置</a-button>
            </a-form-item>
        </a-form>
    </div>
    <div class="p-5 bg-white mt-5">
        <!-- 操作按钮 -->
        <div class="mb-5">
            <a-button type="primary" @click="addPermissionGroupFn">新增权限组</a-button>
        </div>
        <!-- 表格 -->
        <a-table :scroll="{ x: 'max-content' }" bordered :columns="columns" :data-source="data" :loading="isLoading"
            :row-key="(record: any) => record.id">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'identifying'">
                    <a-tag :bordered="false" :color="record.permissions ? 'default' : 'processing'">{{
                        record.identifying
                        || '无标识' }}</a-tag>
                </template>

                <template v-if="column.key === 'desc'">
                    <a-tag :bordered="false" :color="record.permissions ? 'default' : 'purple'">{{ record.desc || '无描述'
                    }}</a-tag>
                </template>

                <!-- 操作 -->
                <template v-if="column.key === 'action'">
                    <a-tooltip title="新增">
                        <!-- 只有权限组有新增 -->
                        <a-button type="link" v-if="record.permissions" @click="addPermissionFun(record)">新增</a-button>
                    </a-tooltip>
                    <a-tooltip title="修改">
                        <a-button type="link" @click="updatePermission(record)">修改</a-button>
                    </a-tooltip>
                    <a-tooltip title="删除">
                        <a-button type="link" danger @click="delPermission(record)">删除</a-button>
                    </a-tooltip>
                </template>

            </template>
        </a-table>
        <addPermissionGroup ref="addPermissionGroupRef" @refreshData="queryPermissionGroup" />
        <addPermission ref="addPermissionRef" @refreshData="queryPermissionGroup" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue';
import { getPermissionsApi, delPermissionGroupApi, delPermissionApi } from '@/apis/permission'
import addPermissionGroup from './addPermissionGroup.vue'
import addPermission from './addPermission.vue';

interface FormState {
    name: string;
}

const formRef = ref<any>(null)
const formState = reactive<FormState>({
    name: '',
});

const onFinish = () => {
    queryPermissionGroup()
}

onMounted(() => {
    queryPermissionGroup()
})

// 获取菜单
const queryPermissionGroup = async () => {
    isLoading.value = true
    const res: any = await getPermissionsApi()
    if (res?.code === 200) {
        data.value = res?.data.map((v: any) => {
            return {
                ...v,
                children: v.permissions
            }
        })
        isLoading.value = false;
    }

}

const resetForm = () => {
    formState.name = ''
    queryPermissionGroup()
}



const data: any = ref([])
const isLoading = ref<Boolean>(false)
const columns = ref([
    {
        title: '权限组名称',
        dataIndex: 'name',
        key: 'name',
        align: "center"
    },
    {
        title: '权限标识',
        dataIndex: 'identifying',
        key: 'identifying',
        align: "center"
    },
    {
        title: '权限描述',
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


const addPermissionGroupRef = <any>ref(null)

const addPermissionGroupFn = () => {
    addPermissionGroupRef.value && addPermissionGroupRef.value.openDialog()
}

/**
 * 删除权限/权限组
 * @param item 
 */
const delPermission = (item: any) => {
    Modal.confirm({
        title: '确认',
        content: `该操作将永久删除该${item.permissions ? '权限组' : '权限'}`,
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            if (item.permissions) {
                const res: any = await delPermissionGroupApi(item)
                if (res?.code == 200) {
                    message.success('删除成功')
                    queryPermissionGroup()
                }
            } else {
                const res: any = await delPermissionApi(item)
                if (res?.code == 200) {
                    message.success('删除成功')
                    queryPermissionGroup()
                }
            }
        }
    });
}

/**
 * 更新权限/权限组
 * @param item 
 */
const updatePermission = (item: any) => {
    // 权限组
    if (item.permissions) {
        addPermissionGroupRef.value && addPermissionGroupRef.value.openDialog(item)
    } else {
        // 权限
        console.log('quanxian')
        addPermissionRef.value && addPermissionRef.value.openDialog(item, 'update')
    }
}

const addPermissionRef = <any>ref(null)

/**
 * 新增权限
 * @param item 
 */
const addPermissionFun = (item: any) => {
    addPermissionRef.value && addPermissionRef.value.openDialog(item, 'create')
}


</script>


<style scoped lang="scss"></style>
