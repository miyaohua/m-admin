<template>
    <Button type="primary" @click="test">dashboard</Button>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { message } from 'ant-design-vue';

const test = () => {
    console.log('test')
    message.success('dashboard')
}
</script>

<style scoped lang="scss"></style>