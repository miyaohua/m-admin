<template>
    <div class="flex h-screen">
        <div class="hidden md:flex justify-center items-center w-2/6 login-bg"></div>
        <div class="w-full md:w-4/6">
            <router-view />
        </div>
    </div>

</template>

<script setup></script>

<style scoped lang="scss">
.login-bg {
    background: url('https://www.fcadmin.fun/img/auth_banner.jpg') no-repeat;
    background-size: 100% 100%;
}
</style>