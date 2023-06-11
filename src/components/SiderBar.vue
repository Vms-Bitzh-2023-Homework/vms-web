<template>
    <el-menu
        :default-active="useRoute().name"
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

        <el-menu-item index="InOutRecord">
            <el-icon><Clock /></el-icon>
            <span>出入场信息</span>
        </el-menu-item>

        <el-menu-item index="addUser" v-if="showAddUser">
            <el-icon><CirclePlus /></el-icon>
            <span>添加用户</span>
        </el-menu-item>

        <el-menu-item index="userInfo">
            <el-icon><Setting /></el-icon>
            <span>个人中心</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import {
    HomeFilled,
    Avatar,
    Location,
    Document,
    Link,
    Setting,
    CirclePlus,
    Clock,
} from "@element-plus/icons-vue";
import { ref } from "vue";
import router from "../router";
import { useRoute } from "vue-router";

const loginRole = ref<string>();
const showAddUser = ref<boolean>(false);

const handleselect = (key: string) => {
    router.push(`/${key}`);
};

const confirmRole = () => {
    loginRole.value = JSON.parse(
        atob(localStorage.getItem("token")?.split(".")[1] as string)
    ).perms;

    if (loginRole.value === "admin") {
        showAddUser.value = true;
    } else {
        showAddUser.value = false;
    }
};
confirmRole();
</script>

<style scoped></style>
