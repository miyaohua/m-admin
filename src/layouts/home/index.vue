<template>
    <a-layout class="w-full h-full">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="title h-8 m-4 text-base text-center leading-8 text-white">
                <span v-show="!collapsed">{{ appName }}</span>
            </div>
            <!-- 左侧菜单 -->
            <Menu />
        </a-layout-sider>

        <a-drawer class="mobile" :bodyStyle="{
            backgroundColor: '#000',
            padding: '0'
        }" :headerStyle="{
            textAlign: 'center',
            backgroundColor: '#000'
        }" width="250" placement="left" :closable="false" :open="openMobileMenu" @close="onClose">
            <div class="h-15 leading-15 text-center text-white">{{ appName }}</div>
            <Menu />
        </a-drawer>

        <a-layout>
            <!-- 移动端侧边栏 -->
            <div class="mobile-column" @click="toggleMobileColumn">
                <MenuOutlined style="font-size:20px" />
            </div>

            <a-layout-header class="flex justify-between p-0! pr-3! bg-white! h-12!">

                <div class="flex items-center justify-center">
                    <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                </div>


                <div class="flex items-center">
                    <!-- 可云 -->
                    <div @click="jumpVpske"
                        class="mr-1 w-8 h-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                        <CloudOutlined />
                    </div>
                    <!-- 搜索 -->
                    <div class="mr-1 w-8 h-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                        <SearchOutlined />
                    </div>
                    <!-- 全屏 -->
                    <div @click="toggleFullScreen"
                        class="mr-1 w-8 h-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                        <ExpandOutlined />
                    </div>
                    <!-- 设置 -->
                    <div @click="openSettingConfig"
                        class="mr-1 w-8 h-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                        <SettingOutlined />
                    </div>
                    <div class="h-full flex items-center justify-center cursor-pointer">
                        <a-dropdown :trigger="['click']">
                            <a-avatar class="cursor-pointer">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item key="0">
                                        <a href="http://www.alipay.com/">个人信息</a>
                                    </a-menu-item>
                                    <a-menu-item key="1">
                                        <a href="http://www.taobao.com/">消息通知</a>
                                    </a-menu-item>
                                    <a-menu-divider />
                                    <a-menu-item key="3" @click="logout">退出登录</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>


                </div>
            </a-layout-header>
            <a-layout-content class="overflow-y-scroll min-h-72 bg-slate-100 px-3 py-3">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>

    <!-- 全局配置 -->
    <Config ref="configRef" />
</template>


<script lang="ts" setup>
import Config from './config/index.vue'
const appName = import.meta.env.VITE_APP_NAME
import { message, Modal } from 'ant-design-vue';
import Menu from './menu.vue'
import { ref } from 'vue';
import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SettingOutlined,
    ExpandOutlined,
    SearchOutlined,
    CloudOutlined,
    MenuOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const collapsed = ref<boolean>(false);

const logout = () => {
    Modal.confirm({
        title: '确认',
        content: '该操作将退出登录',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            window.localStorage.removeItem('token')
            router.push('/login')
            message.success('登出成功！')
        }
    });

}

// 全屏
const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
const configRef = ref<any>(null)
// 配置
const openSettingConfig = () => {
    configRef.value.showDrawer()
}


const jumpVpske = () => {
    window.open('https://www.vpske.cn')
}


let openMobileMenu = ref(false)
const toggleMobileColumn = () => {
    openMobileMenu.value = true;
}

const onClose = () => {
    openMobileMenu.value = false;
}
</script>


<style scoped lang="scss">
// 路由切换动画
.slide-fade-enter-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}


.trigger {
    font-size: 16px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.fold {
    display: none;
    font-size: 16px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.fold:hover {
    color: #1890ff;
}

.site-layout .site-layout-background {
    background: #fff;
}

.mobile-column {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 80%;
    left: 2px;
    display: none;
    z-index: 99;
    cursor: pointer;
    background: #fff;
    box-shadow: 2px 0 8px #00000026;
    border-radius: 0 4px 4px 0;
    justify-content: center;
    align-items: center;
}

// 小于768px
@media screen and (max-width: 768px) {
    :deep(.ant-layout-sider) {
        position: absolute !important;
        flex: unset !important;
        width: 0 !important;
        min-width: unset !important;
        max-width: unset !important;
        height: 100%;
        z-index: 99;
        transform: translate(-200px);
    }

    .mobile-column {
        display: flex
    }

    .title {
        display: none;
    }

    .trigger {
        display: none;
    }

    .fold {
        display: unset
    }
}

.fz-14 {
    font-size: 14px
}
</style>
