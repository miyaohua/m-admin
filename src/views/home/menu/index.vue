<template>
    <div class="p-5 bg-white">
        <a-form ref="formRef" :model="formState" layout="inline" name="basic" autocomplete="off" @finish="onFinish">
            <a-form-item label="菜单名称" name="name">
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
            <a-button type="primary" @click="addMenuFn">新增菜单</a-button>
        </div>
        <!-- 表格 -->
        <a-table :scroll="{ x: 'max-content' }" bordered :columns="columns" :data-source="data" :loading="isLoading"
            :row-key="(record: any) => record.id">
            <template #bodyCell="{ column, record }">
                <!-- 菜单类型 -->
                <template v-if="column.key === 'menuType'">
                    <a-tag v-if="record.menuType == 'M'" :bordered="false" color="processing">目录
                    </a-tag>
                    <a-tag v-if="record.menuType == 'C'" :bordered="false" color="processing">菜单
                    </a-tag>
                </template>

                <!-- 隐藏显示 -->
                <template v-if="column.key === 'isHidden'">
                    <a-tag v-if="!record.isHidden" :bordered="false" color="purple">显示</a-tag>
                    <a-tag v-else :bordered="false" color="purple">隐藏</a-tag>
                </template>

                <!-- 图标 -->
                <template v-if="column.key === 'menuIcon'">
                    <component :is="getIcon(record.menuIcon)" />
                </template>

                <!-- 组件 -->
                <template v-if="column.key === 'component'">
                    <a-tag v-if="!record.component" :bordered="false" color="success">无
                    </a-tag>
                    <a-tag v-else :bordered="false" color="success">{{ record.component }}
                    </a-tag>
                </template>


                <!-- 操作 -->
                <template v-if="column.key === 'action'">
                    <a-tooltip title="删除菜单">
                        <a-button type="link" danger @click="delMenu(record)">删除</a-button>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
    </div>
    <addMenu ref="addMenuRef" @refreshData="queryMenu"/>
</template>

<script setup lang="ts">
import { menuByNumApi, delMenuApi } from '@/apis/menu';
import { ref, reactive, onMounted, DefineComponent } from 'vue'
import * as icon from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import addMenu from './addMenu.vue';

interface FormState {
    name: string;
}

const formRef = ref<any>(null)
const formState = reactive<FormState>({
    name: '',
});
const addMenuRef = ref<any>(null)

const onFinish = () => {
    queryMenu()
}

onMounted(() => {
    queryMenu()
})

// 获取菜单
const queryMenu = async () => {
    isLoading.value = true
    const res: any = await menuByNumApi(formState)
    if (res?.code == 200) {
        data.value = res.data
    }
    isLoading.value = false;
}

const resetForm = () => {
    formState.name = ''
    queryMenu()
}

const addMenuFn = () => {
    addMenuRef.value.openDialog()
}

// 删除菜单
const delMenu = (row: any) => {
    const { id } = row
    if (row.children && row.children.length) {
        return message.warning('该菜单下存在子菜单，无法进行删除')
    }
    Modal.confirm({
        title: '确认',
        content: '该操作将永久删除该菜单',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            const res: any = await delMenuApi({ id })
            if (res?.code == 200) {
                queryMenu()
            }
        }
    });
}

// 获取图标
const getIcon = (iconName: string): DefineComponent | null => {
    return icon[iconName as keyof typeof icon] || null;
}



const data: any = ref([])
const isLoading = ref<Boolean>(false)
const columns = ref([
    {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
        align: "center"
    },
    {
        title: '菜单路径',
        dataIndex: 'path',
        key: 'path',
        align: "center"
    },
    {
        title: '菜单类型',
        dataIndex: 'menuType',
        key: 'menuType',
        align: "center"
    },
    {
        title: '组件',
        dataIndex: 'component',
        key: 'component',
        align: "center"
    },
    {
        title: '显示隐藏',
        dataIndex: 'isHidden',
        key: 'isHidden',
        align: "center"
    },
    {
        title: '图标',
        dataIndex: 'menuIcon',
        key: 'menuIcon',
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


</script>


<style scoped lang="scss"></style>
