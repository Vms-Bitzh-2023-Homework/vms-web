<template>
    <h1>车库信息</h1>
    <div style="margin: 0 30px 0 30px">
        <div>
            <div>
                <el-button
                    type="primary"
                    text
                    @click="createParkcarInfoVisible = true"
                    >添加新车库信息</el-button
                >
            </div>
            <br />
            <div>
                <el-input
                    v-model="searchParkcarData.parkID"
                    placeholder="请输入需要查找的车库ID"
                    style="width: 200px"
                    autocomplete="off"
                />
                <el-button type="primary" text @click="searchParkcar"
                    >查询</el-button
                >
                <el-button type="primary" text @click="resetSearch"
                    >重置</el-button
                >
            </div>
            <br />
        </div>
        <div class="table_area">
            <el-table :data="parkcarInfoData" stripe style="width: 100%">
                <el-table-column prop="parkNo" label="车库编号" width="160" />
                <el-table-column prop="parkID" label="车库ID" width="160" />
                <el-table-column prop="allspace" label="车库所有车位" width="200" />
                <el-table-column prop="occupied" label="车库已占用车位" width="200" />
                <el-table-column label="操作" width="240">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            text
                            @click="showEditParkcarInfoModel(row)"
                            >修改</el-button
                        >
                        <el-button
                            type="primary"
                            text
                            @click="deleteParkcarInfo(row.parkID)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <el-dialog v-model="editParkcarInfoVisible" title="修改车库信息">
        <el-form :model="editParkcarInfoFrom">
            <el-form-item label="车库编号" :label-width="120">
                <el-input
                    v-model="editParkcarInfoFrom.parkNo"
                    autocomplete="off"
                    disabled
                />
            </el-form-item>
            <el-form-item label="车库ID" :label-width="120">
                <el-input
                    v-model="editParkcarInfoFrom.parkID"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车库所有车位" :label-width="120">
                <el-input
                    v-model="editParkcarInfoFrom.allspace"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车库已占用车位" :label-width="120">
                <el-input v-model="editParkcarInfoFrom.occupied"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editParkcarInfoVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmEditParkcarInfo">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="createParkcarInfoVisible" title="添加新车库信息">
        <el-form :model="createParkcarInfoFrom">
            <el-form-item label="车库ID" :label-width="120">
                <el-input
                    v-model="createParkcarInfoFrom.parkID"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车库所有车位" :label-width="120">
                <el-input
                    v-model="createParkcarInfoFrom.allspace"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="车库已占用车位" :label-width="120">
                <el-input v-model="createParkcarInfoFrom.occupied"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" text @click="resetCreate"
                    >重置</el-button
                >
                <el-button @click="createParkcarInfoVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmCreateParkcarInfo">
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
} from "../types/RespondCode.js";
import http from "../axios/http.js";
import {
    UpdateParkcarInfo,
    CreateParkcarInfo,
    ParkcarRequest,
    ParkcarInfoData,
} from "../types/ParkcarInfo.js";
import router from "../router/index.js";

const parkcarInfoData = ref<ParkcarInfoData[]>();
const editParkcarInfoVisible = ref<boolean>(false);
const createParkcarInfoVisible = ref<boolean>(false);
const editParkcarInfoFrom = reactive<UpdateParkcarInfo>({
    parkNo: null,
    parkID: "",
    allspace: "",
    occupied: "",
});
const createParkcarInfoFrom = reactive<CreateParkcarInfo>({
    parkID: "",
    allspace: "",
    occupied: "",
});
const searchParkcarData = ref<ParkcarInfoData>({
    parkNo: null,
    parkID: "",
    allspace: "",
    occupied: "",
});

// 重置查询信息
const resetSearch = () => {
    searchParkcarData.value = {
        parkNo: null,
        parkID: "",
        allspace: "",
        occupied: "",
    };
    getParkcarInfo();
};
const resetCreate = () => {
    createParkcarInfoFrom.parkID="";
    createParkcarInfoFrom.allspace="";
    createParkcarInfoFrom.occupied="";
        // parkNo: null,
        // parkID: "",
        // allspace: "",
        // occupied: "",
    
    getParkcarInfo();
};

// 查找车库信息
const searchParkcar = () => {
    const params = {
        parkID: searchParkcarData.value.parkID,
    };
    http.get(`/parkcarInfo/${params.parkID}`)
        .then((res: any) => {
            if (res.statusCode === GET_ERR) {
                ElMessage.error("未查询到该ID的车库信息");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                parkcarInfoData.value = res.data;
            }
        })
        .catch(() => {
            ElMessage.error("未查询到该ID的车库信息");
        });
};

const showEditParkcarInfoModel = (parkcarInfo: UpdateParkcarInfo) => {
    editParkcarInfoFrom.parkNo = parkcarInfo.parkNo;
    editParkcarInfoFrom.parkID = parkcarInfo.parkID;
    editParkcarInfoFrom.allspace = parkcarInfo.allspace;
    editParkcarInfoFrom.occupied = parkcarInfo.occupied;
    editParkcarInfoVisible.value = true;
};

// 确认修改
const confirmEditParkcarInfo = () => {
    http.put("/parkcarInfo", editParkcarInfoFrom)
        .then((res: any) => {
            if (res.statusCode === UPDATE_ERR) {
                ElMessage.error("修改失败");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                ElMessage.success("修改成功");
                editParkcarInfoVisible.value = false;
                getParkcarInfo();
            }
        })
        .catch(() => {
            ElMessage.error("添加失败");
        });
};

// 确认添加
const confirmCreateParkcarInfo = () => {
    console.log(createParkcarInfoFrom);
    http.post("/parkcarInfo", createParkcarInfoFrom)
        .then((res: any) => {
            if (res.statusCode === SAVE_ERR) {
                ElMessage.error("添加失败");
            } else if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else {
                ElMessage.success("添加成功");
                createParkcarInfoVisible.value = false;
                getParkcarInfo();
            }
        })
        .catch(() => {
            ElMessage.error("添加失败");
        });
};

// 删除车库信息 确认对话框
const deleteParkcarInfo = (parkID: String) => {
    ElMessageBox.confirm(
        "即将删除该ID的车库信息，此操作不可撤销，是否确认？",
        "警告",
        {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            http.delete(`/parkcarInfo/${parkID}`)
                .then((res: any) => {
                    if (res.statusCode === DELETE_ERR) {
                        ElMessage.error("删除失败");
                    } else if (res.statusCode === LOGIN_ERR) {
                        router.push("/login");
                    } else {
                        ElMessage.success("删除成功");
                        getParkcarInfo();
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

// 获取车库信息
const getParkcarInfo = () => {
    http.get<ParkcarRequest>("/parkcarInfo")
        .then((res: ParkcarRequest) => {
            if (res.statusCode === LOGIN_ERR) {
                router.push("/login");
            } else if (res.statusCode === GET_ERR) {
                ElMessage.error("网络繁忙，请稍后再试");
            } else {
                parkcarInfoData.value = res.data;
            }
        })
        .catch(() => {
            ElMessage.error("网络繁忙，请稍后再试");
        });
};

getParkcarInfo();
</script>

<style scoped>
.table_area {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
