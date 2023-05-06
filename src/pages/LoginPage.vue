<template>
    <div class="pages">
        <div>
            <el-card class="box_ard">
                <template #header>
                    <div class="card_header">
                        <span>停车场管理系统·登录</span>
                    </div>
                </template>
                <div>
                    <el-form
                        label-position="right"
                        label-width="100px"
                        :model="loginForm"
                    >
                        <el-form-item label="用户名">
                            <el-input v-model="loginForm.userName" @keyup.enter="login" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input
                                type="password"
                                v-model="loginForm.password"
                                @keyup.enter="login"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div style="display: flex; justify-content: end">
                    <el-button type="primary"  @click="login">登录</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import http from "../axios/http";
import { LOGIN_ERR } from "../types/RespondCode";
import router from "../router";

const loginForm = reactive({
    userName: "",
    password: "",
});

const login = () => {
    http.get("/login", loginForm)
        .then((res: any) => {
            if (res.statusCode === LOGIN_ERR) {
                ElMessage.error(res.msg);
            } else {
                localStorage.setItem("token", res.token);
                ElMessage.success("登录成功");
                router.push("/home");
            }
        })
        .catch(() => {
            ElMessage.error("登录失败");
        });
};
</script>

<style scoped>
.pages {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("https://ys.mihoyo.com/main/_nuxt/img/47f71d4.jpg");
    background-size: cover;
}

.card_header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.box_ard {
    width: 450px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 24px;
    font-size: x-large;
}
</style>
