<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <h1>停车场车辆管理系统</h1>
                <div style="display: flex; align-items: center">
                    <el-button type="primary" @click="logout"
                        >退出登录</el-button
                    >
                </div>
            </el-header>
            <el-container>
                <el-container>
                    <el-aside width="200px"><SiderBar></SiderBar></el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
                <el-footer>Copyright © 2023 Design By Julien and lzh. 保留所有权利。</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import SiderBar from "../components/SiderBar.vue";
import router from "../router";

const logout = () => {
    ElMessageBox.confirm("是否退出登录？", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            localStorage.removeItem("token");
            router.push("/login");
            ElMessage.success("退出成功")
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消",
            });
        });
};
</script>

<style scoped>
.el-header {
    text-align: center;
    height: 60px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
}

.el-aside {
    height: calc(100vh-120px);
}

.el-footer {
    text-align: center;
    height: 60px;
}
</style>
