<template>
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark" mode="inline"
        @click="menuClick" :items="menuItem">
    </a-menu>
</template>

<script lang="ts" setup>
import { h, ref, onMounted } from 'vue'
import * as icon from '@ant-design/icons-vue';
import { getRoute } from '@/apis/route'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
    getTreeMenu()
})

const getTreeMenu = async () => {
    const res: any = await getRoute()
    if (res?.code == 200) {
        res.data = formatMenu(res.data)
        menuItem.value = [...menuItem.value, ...res.data]
    }
}

// 处理菜单
const formatMenu = (arr: any[]) => {
    arr.forEach((r: any) => {
        const iconName: (keyof typeof icon) = r.menuIcon
        r.icon = () => h(icon[iconName]);
        r.key = r.path
        r.label = r.name
        r.title = r.name
        r.disabled = r.isHidden
        delete r.component
        delete r.created_at
        delete r.id
        delete r.isHidden
        delete r.isIframe
        delete r.updated_at
        delete r.menuType
        delete r.name
        delete r.menuIcon
        if (r.children && r.children.length) {
            formatMenu(r.children)
        } else {
            r.children = null;
        }
    });
    return arr
}


const selectedKeys = ref<string[]>(['dashboard']);
const openKeys = ref(['dashboard'])
// 菜单列表
const menuItem = ref([
    {
        key: '/dashboard',
        icon: () => h(icon['HomeOutlined']),
        label: '仪表盘',
        title: '仪表盘',
    }
])

const menuClick = (item) => {
    router.push(item.key)
}
</script>


<style scoped lang="scss"></style>