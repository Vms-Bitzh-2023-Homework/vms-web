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
                <el-form-item label="请输入旧密码" prop="oldPwd">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.oldPwd"
                    />
                </el-form-item>

                <el-form-item label="请输入新密码" prop="newPwd">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.newPwd"
                    />
                </el-form-item>

                <el-form-item label="请再次输入新密码" prop="confirmPwd">
                    <el-input
                        type="password"
                        show-password
                        v-model="changePwdForm.confirmPwd"
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

const userInfo = ref<UserInfo>({
    userName: "",
    userRole: "",
    userID: 0,
});
const changePwdFormRef = ref<FormInstance>();
const changePwdForm = reactive<ChangePwdForm>({
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
});
const checkConfirmPwd = (_rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("请再次输入新密码。"));
    } else if (value !== changePwdForm.newPwd) {
        callback(new Error("两次输入的密码不一致。"));
    } else {
        callback();
    }
};

const rules = reactive<FormRules>({
    oldPwd: [{ required: true, message: "请输入旧密码。", trigger: "blur" }],
    newPwd: [{ required: true, message: "请输入新密码。", trigger: "blur" }],
    confirmPwd: [
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
            console.log("submit!");
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
