<template>
    <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name" title="全局配置修改"
        placement="right">
        <div>
            <span class="fz-14">全局组件大小配置：</span>
            <a-radio-group class="ml-3" v-model:value="size">
                <a-radio-button @click="changeSize('large')" value="large">大</a-radio-button>
                <a-radio-button @click="changeSize('middle')" value="middle">默认</a-radio-button>
                <a-radio-button @click="changeSize('small')" value="small">小</a-radio-button>
            </a-radio-group>
        </div>
        <a-divider />
    </a-drawer>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalSizeStore } from '@/store/globalSize'

const globalSizeStore = useGlobalSizeStore();

const open = ref<boolean>(false);
const showDrawer = () => {
    open.value = true;
};

const size = ref(globalSizeStore.globalSize)

const changeSize = (size: string) => {
    globalSizeStore.setGlobalSize(size)
}

defineExpose({
    showDrawer
})
</script>


<style scoped lang="scss">
.fz-14 {
    font-size: 14px;
}
</style>