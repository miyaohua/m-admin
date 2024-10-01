<template>
    <a-modal okText="确认" cancelText="取消" centered v-model:open="open" :title="editId ? '修改菜单' : '新增菜单'" @ok="handleOk"
        @cancel="handleCancel" :maskClosable="false">
        <a-form ref="formRef" class="mt-5" layout="horizontal" :model="formState" :label-col="{
            style: {
                width: '80px'
            }
        }">
            <a-form-item name="fid" label="父级菜单"
                :rules="[{ required: true, message: '请选择父级菜单', trigger: ['change', 'blur'] }]">
                <a-tree-select v-model:value="formState.fid" show-search style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择父级菜单" allow-clear
                    tree-default-expand-all :tree-data="treeData" tree-node-filter-prop="label">
                </a-tree-select>
            </a-form-item>
            <a-form-item name="name" label="菜单名称"
                :rules="[{ required: true, message: '请输入菜单名称', trigger: ['change', 'blur'] }]">
                <a-input v-model:value="formState.name" placeholder="示例：权限管理" />
            </a-form-item>

            <a-form-item name="path" label="菜单路径"
                :rules="[{ required: true, message: '请输入菜单路径', trigger: ['change', 'blur'] }]">
                <a-input v-model:value="formState.path" placeholder="示例：/system/permission" />
            </a-form-item>

            <a-form-item name="menuType" label="菜单类型"
                :rules="[{ required: true, message: '请输入菜单类型', trigger: ['change', 'blur'] }]">
                <a-select v-model:value="formState.menuType" placeholder="请选择菜单类型" @change="typeChange">
                    <a-select-option value="C">菜单</a-select-option>
                    <a-select-option value="M">目录</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item name="component" label="组件地址" :rules="componentRules">
                <a-input :disabled="componentDisabled" v-model:value="formState.component" placeholder="请输入组件地址" />
            </a-form-item>

            <a-form-item name="isHidden" label="是否展示"
                :rules="[{ required: true, message: '是否展示', trigger: ['change', 'blur'] }]">
                <a-select v-model:value="formState.isHidden" placeholder="是否展示">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item name="icon" label="图标"
                :rules="[{ required: true, message: '请选择图标', trigger: ['change', 'blur'] }]">
                <a-input readonly v-model:value="formState.icon" placeholder="请选择图标">
                    <template #addonAfter>
                        <a-popover title="选择图标">
                            <template #content>
                                <div class="icon-wrap">
                                    <span @click="selectIcon(iconName)" v-for="(iconName, index) in iconNames"
                                        :key="index" class="icon-item">
                                        <!-- 设置tooltip会有明显卡顿，待优化 -->
                                        <!-- <a-tooltip placement="topLeft" :title="iconName"> -->
                                        <component :is="icon[iconName]" />
                                        <!-- </a-tooltip> -->
                                    </span>
                                </div>
                            </template>
                            <EllipsisOutlined />
                        </a-popover>
                    </template>
                </a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>


<script setup lang="ts">
import { menuByNumApi, addMenuApi } from '@/apis/menu';
import { ref, defineExpose, computed, defineEmits } from 'vue'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import * as icon from '@ant-design/icons-vue/es/icons/index';

const emits = defineEmits(['refreshData'])

// 获取所有图标的名称
const iconNames = Object.keys(icon);

const open = ref(false)

const editId = ref('')

const formRef = <any>ref(null)

const formState = <any>ref({
    fid: null,
    name: '',
    path: '',
    menuType: null,
    component: '',
    isHidden: null,
    icon: null,
})

const treeData = <any>ref([])

// 组件地址是否禁用
const componentDisabled = computed(() => {
    return formState.value.menuType === 'M'
})
const componentRules = computed(() => {
    const rule = [{ required: true, message: '请输入组件地址', trigger: ['change', 'blur'] }]
    return formState.value.menuType === 'C' || !formState.value.menuType ? rule : [];
})
const typeChange = (value: string) => {
    if (value === 'M') {
        formState.value.component = ''
    }
}

const openDialog = (id: string) => {
    editId.value = id
    open.value = true
    // 获取所有菜单数据
    getAllMenu()
}

const getAllMenu = async () => {
    const res: any = await menuByNumApi({})
    if (res?.code == 200) {
        treeData.value = [{ label: '顶级菜单', value: 0 }, ...handleMenu(res.data)]
    }
}

const selectIcon = (iconName: string) => {
    formState.value.icon = iconName
}

// 处理菜单配置项
const handleMenu = (menu: any) => {
    // 过滤出菜单类型为目录的数据
    return menu
        // .filter((r: any) => r.menuType == 'M')
        .map((item: any) => {
            return {
                value: item.id,
                label: item.name,
                disabled: item.menuType !== 'M',
                children: item.children && handleMenu(item.children) || [],
            }
        })
}


const handleOk = () => {
    console.log('handleOk', formState.value)
    formRef.value
        .validate()
        .then(async () => {
            const value = {
                name: formState.value.name,
                path: formState.value.path,
                isHidden: formState.value.isHidden == 0,
                component: formState.value.component,
                isIframe: false,
                menuType: formState.value.menuType,
                parentId: formState.value.fid,
                menuIcon: formState.value.icon,
            }
            const res: any = await addMenuApi(value)
            if (res?.code == 200) {
                open.value = false
                formRef.value.resetFields();
                emits('refreshData')
            }
        })
        .catch((error: any) => {
        });
}

const handleCancel = () => {
    formRef.value.resetFields();
}

defineExpose({
    openDialog
})

</script>

<style scoped lang="scss">
.icon-wrap {
    width: 300px;
    height: 300px;
    overflow: auto;
    box-sizing: border-box;
    padding: 3px;

    .icon-item {
        cursor: pointer;

        span {
            font-size: 18px;
            margin: 10px;
        }
    }
}
</style>