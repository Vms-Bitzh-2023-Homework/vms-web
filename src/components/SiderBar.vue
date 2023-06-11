<template>
    <el-menu
        default-active="home"
        class="el-menu-vertical-demo"
        @select="handleselect"
        :style="{ height: 'calc(100vh - 120px)' }"
    >
        <el-menu-item index="home">
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

        <el-menu-item index="parkcarInfo">
            <el-icon><Document /></el-icon>
            <span>车库信息</span>
        </el-menu-item>
        <el-menu-item index="order">
            <el-icon><Link /></el-icon>
            <span>订单信息</span>
        </el-menu-item>
    </el-menu>

</template>

<script setup lang="ts">
import { HomeFilled, Avatar, Location, Document,Link } from "@element-plus/icons-vue";
import router from "../router";


const handleselect = (key: string) => {
    router.push(`/${key}`)
}
</script>

<style scoped></style>
