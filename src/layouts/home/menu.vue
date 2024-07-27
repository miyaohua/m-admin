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
        console.log(res.data);

        menuItem.value = [...menuItem.value, ...res.data]
    }
}

// 处理菜单
const formatMenu = (arr: any[]) => {
    return arr.map((r: any): any => {
        const iconName: (keyof typeof icon) = r.menuIcon
        const item = {
            icon: () => h(icon[iconName]),
            key: r.path,
            label: r.name,
            title: r.name,
            disabled: r.isHidden,
            children: r.children
        }
        if (r.children && r.children.length) {
            item.children = formatMenu(r.children)
        } else {
            item.children = null;
        }
        return item;
    });
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