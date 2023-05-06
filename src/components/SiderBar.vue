<template>
    <el-menu
        default-active="home"
        class="el-menu-vertical-demo"
        router
        :style="{ height: 'calc(100vh - 120px)' }"
    >
        <el-menu-item index="Home">
            <el-icon><HomeFilled /></el-icon>
            <span>主页</span>
        </el-menu-item>

        <el-menu-item index="parkingCar">
            <el-icon><location /></el-icon>
            <span>在停车辆</span>
        </el-menu-item>

        <el-menu-item index="visitorInfo">
            <el-icon><Avatar /></el-icon>
            <span>车主信息</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import { HomeFilled, Avatar, Location } from "@element-plus/icons-vue";
</script>

<style scoped></style>
