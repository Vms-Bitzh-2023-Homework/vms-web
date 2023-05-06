<template>
    <h1>车主信息</h1>
    <div style="margin: 0 30px 0 30px">
        <div>
            <div>
                <el-button
                    type="primary"
                    text
                    @click="createVisitorInfoVisible = true"
                    >添加车主信息</el-button
                >
            </div>
            <br />
            <div>
                <el-input
                    v-model="searchVisitorData.visName"
                    placeholder="请输入需要查找的车主姓名"
                    style="width: 200px"
                    autocomplete="off"
                />
                <el-button type="primary" text @click="searchVisitor"
                    >查询</el-button
                >
                <el-button type="primary" text @click="resetSearch"
                    >重置</el-button
                >
            </div>
            <br />
        </div>
        <div class="table_area">
            <el-table :data="visitorInfoData" stripe style="width: 100%">
                <el-table-column prop="id" label="车主ID" width="160" />
                <el-table-column prop="visName" label="车主姓名" width="160" />
                <el-table-column prop="carNo" label="车牌号" width="200" />
                <el-table-column prop="visPhone" label="车主电话" width="200" />
                <el-table-column label="操作" width="240">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            text
                            @click="showEditVisitorInfoModel(row)"
                            >修改</el-button
                        >
                        <el-button
                            type="primary"
                            text
                            @click="deleteVisitorInfo(row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <el-dialog v-model="editVisitorInfoVisible" title="修改车主信息">
        <el-form :model="editVisitorInfoFrom">
            <el-form-item label="车主ID" :label-width="120">
                <el-input
                    v-model="editVisitorInfoFrom.id"
                    autocomplete="off"
                    disabled
                />
            </el-form-item>
            <el-form-item label="车主姓名" :label-width="120">
                <el-input
                    v-model="editVisitorInfoFrom.visName"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车牌号码" :label-width="120">
                <el-input
                    v-model="editVisitorInfoFrom.carNo"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车主电话" :label-width="120">
                <el-input v-model="editVisitorInfoFrom.visPhone"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editVisitorInfoVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmEditVisitorInfo">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="createVisitorInfoVisible" title="添加车主信息">
        <el-form :model="createVisitorInfoFrom">
            <el-form-item label="车主姓名" :label-width="120">
                <el-input
                    v-model="createVisitorInfoFrom.visName"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车牌号码" :label-width="120">
                <el-input
                    v-model="createVisitorInfoFrom.carNo"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车主电话" :label-width="120">
                <el-input v-model="createVisitorInfoFrom.visPhone"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="createVisitorInfoVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmCreateVisitorInfo">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
    LOGIN_ERR,
    GET_ERR,
    DELETE_ERR,
    UPDATE_ERR,
    SAVE_ERR,
} from "../types/RespondCode";
import http from "../axios/http";
import {
    UpdateVisitorInfo,
    CreateVisitorInfo,
    VisitorRequest,
    VisitorInfoData,
} from "../types/VisitorInfo";
import router from "../router";

const visitorInfoData = ref<VisitorInfoData[]>();
const editVisitorInfoVisible = ref<boolean>(false);
const createVisitorInfoVisible = ref<boolean>(false);
const editVisitorInfoFrom = reactive<UpdateVisitorInfo>({
    id: 0,
    carNo: "",
    visPhone: "",
    visName: "",
});
const createVisitorInfoFrom = reactive<CreateVisitorInfo>({
    carNo: "",
    visPhone: "",
    visName: "",
});
const searchVisitorData = ref<VisitorInfoData>({
    id: null,
    carNo: "",
    visPhone: "",
    visName: "",
});

// 重置查询信息
const resetSearch = () => {
    searchVisitorData.value = {
        id: null,
        carNo: "",
        visPhone: "",
        visName: "",
    };
    getVisitorInfo();
};

// 查找车主信息
const searchVisitor = () => {
    const params = {
        visName: searchVisitorData.value.visName,
    };
    http.get(`/visitorInfo/${params.visName}`)
        .then((res: any) => {
            if (res.statusCode === GET_ERR) {
                ElMessage.error("未查询到相关车主信息");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                const data: VisitorInfoData = res.data;
                const searchResult: Array<VisitorInfoData> = [];
                searchResult.push(data);
                visitorInfoData.value = searchResult;
            }
        })
        .catch(() => {
            ElMessage.error("未查询到相关车主信息");
        });
};

const showEditVisitorInfoModel = (visitorInfo: UpdateVisitorInfo) => {
    editVisitorInfoFrom.id = visitorInfo.id;
    editVisitorInfoFrom.carNo = visitorInfo.carNo;
    editVisitorInfoFrom.visPhone = visitorInfo.visPhone;
    editVisitorInfoFrom.visName = visitorInfo.visName;

    editVisitorInfoVisible.value = true;
};

// 确认修改
const confirmEditVisitorInfo = () => {
    http.put("/visitorInfo", editVisitorInfoFrom)
        .then((res: any) => {
            if (res.statusCode === UPDATE_ERR) {
                ElMessage.error("修改失败");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                ElMessage.success("修改成功");
                editVisitorInfoVisible.value = false;
                getVisitorInfo();
            }
        })
        .catch(() => {
            ElMessage.error("添加失败");
        });
};

// 确认添加
const confirmCreateVisitorInfo = () => {
    console.log(createVisitorInfoFrom);
    http.post("/visitorInfo", createVisitorInfoFrom)
        .then((res: any) => {
            if (res.statusCode === SAVE_ERR) {
                ElMessage.error("添加失败");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                ElMessage.success("添加成功");
                createVisitorInfoVisible.value = false;
                getVisitorInfo();
            }
        })
        .catch(() => {
            ElMessage.error("添加失败");
        });
};

// 删除车主信息 确认对话框
const deleteVisitorInfo = (id: number) => {
    ElMessageBox.confirm(
        "即将删除该车主信息，此操作不可撤销，是否确认？",
        "警告",
        {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            http.delete(`/visitorInfo/${id}`)
                .then((res: any) => {
                    if (res.statusCode === DELETE_ERR) {
                        ElMessage.error("删除失败");
                    } else if (res.statusCode === LOGIN_ERR) {
                        router.push("/login");
                    } else {
                        ElMessage.success("删除成功");
                        getVisitorInfo();
                    }
                })
                .catch(() => {
                    ElMessage.error("删除失败");
                });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消",
            });
        });
};

// 获取在停车辆信息
const getVisitorInfo = () => {
    http.get<VisitorRequest>("/visitorInfo")
        .then((res: VisitorRequest) => {
            if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else if (res.statusCode === GET_ERR) {
                ElMessage.error("网络繁忙，请稍后再试");
            } else {
                visitorInfoData.value = res.data;
            }
        })
        .catch(() => {
            ElMessage.error("网络繁忙，请稍后再试");
        });
};

getVisitorInfo();
</script>

<style scoped>
.table_area {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
