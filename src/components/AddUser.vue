<template>
    <h1>添加用户</h1>
    <el-divider />
    <div class="form">
        <el-form
            ref="addUserFormRef"
            :model="addUserForm"
            :rules="rules"
            label-width="150px"
            status-icon
        >
            <el-form-item label="请输入用户名" prop="userName">
                <el-input v-model="addUserForm.userName" />
            </el-form-item>

            <el-form-item label="请输入手机号" prop="adPhone">
                <el-input v-model="addUserForm.adPhone" />
            </el-form-item>

            <el-form-item label="请输入密码" prop="password">
                <el-input
                    type="password"
                    show-password
                    v-model="addUserForm.password"
                />
            </el-form-item>

            <el-form-item label="请再次输入密码" prop="confirmPwd">
                <el-input
                    type="password"
                    show-password
                    v-model="addUserForm.confirmPwd"
                />
            </el-form-item>

            <el-form-item label="请选择用户权限" prop="perms">
                <el-select v-model="addUserForm.perms" placeholder="请选择">
                    <el-option
                        v-for="item in roleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>

            <div style="display: flex; justify-content: end">
                <el-form-item>
                    <el-button @click="resetForm(addUserFormRef)"
                        >重置</el-button
                    >
                    <el-button
                        type="primary"
                        @click="submitForm(addUserFormRef)"
                    >
                        确认修改
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { AddUserForm } from "../types/UserInfo";
import http from "../axios/http";
import { LOGIN_ERR, SAVE_ERR } from "../types/RespondCode";
import router from "../router";

const addUserFormRef = ref<FormInstance>();
const addUserForm = reactive<AddUserForm>({
    userName: "",
    adPhone: "",
    password: "",
    perms: "",
    confirmPwd: "",
});
const roleList = [
    {
        label: "管理员",
        value: "admin",
    },
    {
        label: "普通用户",
        value: "user",
    },
];
const checkConfirmPwd = (_rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("请再次输入新密码。"));
    } else if (value !== addUserForm.password) {
        callback(new Error("两次输入的密码不一致。"));
    } else {
        callback();
    }
};
const checkAdPhone = (_rule: any, value: any, callback: any) => {
    const pattern =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!pattern.test(value)) {
        callback(new Error("请正确输入手机号"));
    } else {
        callback();
    }
};

const rules = reactive<FormRules>({
    userName: [{ required: true, message: "请输入用户名。", trigger: "blur" }],
    adPhone: [
        { required: true, message: "请输入手机号。", trigger: "blur" },
        { validator: checkAdPhone, trigger: "blur" },
    ],
    perms: [{ required: true, message: "请选择权限。", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码。", trigger: "blur" }],
    confirmPwd: [
        { required: true, message: "请再次输入新密码。", trigger: "blur" },
        { validator: checkConfirmPwd, trigger: "blur" },
    ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            http.post("/user/addUser", addUserForm)
                .then((res: any) => {
                    if (res.statusCode === LOGIN_ERR) {
                        ElMessage.warning("授权信息过期，请重新登录");
                        router.push("/login");
                    } else if (res.statusCode === SAVE_ERR) {
                        ElMessage.error("添加失败");
                    } else {
                        ElMessage.success("添加成功！");
                        addUserForm.adPhone = "",
                        addUserForm.confirmPwd = "",
                        addUserForm.password = "",
                        addUserForm.perms = "",
                        addUserForm.userName = ""
                    }
                })
                .catch((_err) => {
                    ElMessage.error("添加失败");
                });
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
    width: 500px;
}
</style>
