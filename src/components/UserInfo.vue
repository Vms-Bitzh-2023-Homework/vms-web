<template>
    <h1>个人中心</h1>
    <el-divider />
    <div class="owner">
        <h3>用户信息</h3>
        <p>用户名：{{ userInfo?.userName }}</p>
        <p>身份：{{ userInfo?.userRole }}</p>
        <p>用户id：{{ userInfo?.userID }}</p>
    </div>
    <el-divider />
    <div class="changePwd">
        <h3>修改密码</h3>
        <div class="form">
            <el-form
                ref="changePwdFormRef"
                :model="changePwdForm"
                :rules="rules"
                label-width="150px"
                status-icon
            >
                <el-form-item label="请输入旧密码" prop="oldPassword">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.oldPassword"
                    />
                </el-form-item>

                <el-form-item label="请输入新密码" prop="newPassword">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.newPassword"
                    />
                </el-form-item>

                <el-form-item label="请再次输入新密码" prop="checkPassword">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.checkPassword"
                    />
                </el-form-item>

                <div style="display: flex; justify-content: end">
                    <el-form-item>
                        <el-button @click="resetForm(changePwdFormRef)"
                            >重置</el-button
                        >
                        <el-button
                            type="primary"
                            @click="submitForm(changePwdFormRef)"
                        >
                            确认修改
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { UserInfo, ChangePwdForm } from "../types/UserInfo";
import type { FormInstance, FormRules } from "element-plus";
import http from "../axios/http";
import router from "../router";
import { LOGIN_ERR, SAVE_ERR } from "../types/RespondCode";

const userInfo = ref<UserInfo>({
    userName: "",
    userRole: "",
    userID: 0,
});
const changePwdFormRef = ref<FormInstance>();
const changePwdForm = reactive<ChangePwdForm>({
    oldPassword: "",
    newPassword: "",
    checkPassword: "",
});
const checkConfirmPwd = (_rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("请再次输入新密码。"));
    } else if (value !== changePwdForm.newPassword) {
        callback(new Error("两次输入的密码不一致。"));
    } else {
        callback();
    }
};

const rules = reactive<FormRules>({
    oldPassword: [{ required: true, message: "请输入旧密码。", trigger: "blur" }],
    newPassword: [{ required: true, message: "请输入新密码。", trigger: "blur" }],
    checkPassword: [
        { required: true, message: "请再次输入新密码。", trigger: "blur" },
        { validator: checkConfirmPwd, trigger: "blur" },
    ],
});

const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decode = JSON.parse(atob(token?.split(".")[1] as string));
        (userInfo.value.userName = decode.userName),
            (userInfo.value.userRole =
                decode.perms == "admin" ? "管理员" : "普通用户"),
            (userInfo.value.userID = Number(decode.id));
    }
};

getUserInfo();

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            http.put("/user/modifyPassword",changePwdForm).then((res: any) => {
                if (res.statusCode === LOGIN_ERR) {
                        ElMessage.warning("授权信息过期，请重新登录");
                        router.push("/login");
                    } else if (res.statusCode === SAVE_ERR) {
                        ElMessage.error(res.msg);
                    } else {
                        ElMessage.success("修改成功,请重新登录。");
                        localStorage.removeItem("token")
                        router.push("/login")
                    }
            }).catch((_err) => {
                ElMessage.error("修改失败，请稍后再试。")
            })
        } else {
            console.log("error submit!", fields);
        }
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style scoped>
.form {
    width: 450px;
}
</style>
