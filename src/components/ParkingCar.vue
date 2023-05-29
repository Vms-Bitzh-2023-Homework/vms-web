<template>
    <h1>在停车辆信息</h1>
    <div style="margin: 0 30px 0 30px">
        <div>
            <div>
                <el-button
                    type="primary"
                    text
                    @click="showCreateParkingCarModel"
                    >添加车辆信息</el-button
                >
            </div>
            <br />
            <div>
                <el-input
                    v-model="searchParkingCarData.carNo"
                    placeholder="请输入需要查找的车牌号"
                    style="width: 200px"
                />
                <el-button type="primary" text @click="searchParkingCar"
                    >查询</el-button
                >
                <el-button type="primary" text @click="resetSearch"
                    >重置</el-button
                >
            </div>
            <br />
        </div>
        <div class="table_area">
            <el-table :data="parkingCarData" stripe style="width: 100%">
                <el-table-column prop="carNo" label="车牌号码" width="160" />
                <el-table-column prop="in_time" label="入场时间" width="200">
                    <template #default="{ row }">
                        <span>{{
                            FormatDate(new Date(row.in_time), "datetime", true)
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            text
                            @click="showEditParkingCarModel(row)"
                            >修改</el-button
                        >
                        <el-button
                            type="primary"
                            text
                            @click="outParkingCar(row)"
                            >出场</el-button
                        >
                        <el-button
                            type="primary"
                            text
                            @click="deleteParkingCar(row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <el-dialog v-model="editParkingCarVisible" title="修改车辆信息">
        <el-form :model="editParkingCarFrom">
            <el-form-item label="车牌号码" :label-width="120">
                <el-input
                    v-model="editParkingCarFrom.carNo"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="入场时间" :label-width="120">
                <el-input
                    v-model="editParkingCarFrom.in_time"
                    disabled
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editParkingCarVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmEditParkingCar">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="createParkingCarVisible" title="添加车辆信息">
        <el-form :model="createParkingCarFrom">
            <el-form-item label="车牌号码" :label-width="120">
                <el-input
                    v-model="createParkingCarFrom.carNo"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="入场时间" :label-width="120">
                <el-input
                    v-model="createParkingCarFrom.in_time"
                    disabled
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="createParkingCarVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="confirmCreateParkingCar">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import FormatDate from "../common/FormatDate";
import {
    LOGIN_ERR,
    GET_ERR,
    DELETE_ERR,
    UPDATE_ERR,
    SAVE_ERR,
} from "../types/RespondCode";
import http from "../axios/http";
import {
    ParkingCarData,
    UpdateParkingCar,
    CreateParkingCar,
    ParkingRespon,
} from "../types/ParkingCar";
import router from "../router";

const parkingCarData = ref<ParkingCarData[]>();
const editParkingCarVisible = ref<boolean>(false);
const createParkingCarVisible = ref<boolean>(false);
const editParkingCarFrom = reactive<UpdateParkingCar>({
    id: 0,
    carNo: "",
    in_time: "",
    out_time: null,
});
const createParkingCarFrom = reactive<CreateParkingCar>({
    carNo: "",
    in_time: "",
    out_time: null,
});
const searchParkingCarData = ref<ParkingCarData>({
    id: 0,
    carNo: "",
    in_time: "",
    out_time: "",
});

// 重置查询信息
const resetSearch = () => {
    searchParkingCarData.value = {
        id: 0,
        carNo: "",
        in_time: "",
        out_time: "",
    };
    getParkingCar();
};

// 查找车辆信息
const searchParkingCar = () => {
    const params = {
        carNo: searchParkingCarData.value.carNo,
    };
    http.get(`/inOutRecord/${params.carNo}`)
        .then((res: any) => {
            if (res.statusCode === GET_ERR) {
                ElMessage.error("未查询到相关车辆信息");
            } else if (res.statusCode === LOGIN_ERR) {
                ElMessage.warning("授权信息过期，请重新登录");
                router.push("/login");
            } else {
                parkingCarData.value = res.data;
            }
        })
        .catch(() => {
            ElMessage.error("未查询到相关车辆信息");
        });
};

const showEditParkingCarModel = (parkingCarForm: UpdateParkingCar) => {
    editParkingCarFrom.id = parkingCarForm.id;
    editParkingCarFrom.carNo = parkingCarForm.carNo;
    editParkingCarFrom.in_time = FormatDate(
        new Date(parkingCarForm.in_time),
        "datetime",
        true
    );

    editParkingCarVisible.value = true;
};

// 确认修改
const confirmEditParkingCar = () => {
    http.put("/inOutRecord", editParkingCarFrom)
        .then((res: any) => {
            if (res.statusCode === UPDATE_ERR) {
                ElMessage.error("修改失败");
            } else if (res.statusCode === LOGIN_ERR) {
                ElMessage.warning("授权信息过期，请重新登录");
                router.push("/login");
            } else {
                ElMessage.success("修改成功");
                editParkingCarVisible.value = false;
                getParkingCar();
            }
        })
        .catch(() => {
            ElMessage.error("修改失败");
        });
};

// 显示添加对话框
const showCreateParkingCarModel = () => {
    createParkingCarFrom.in_time = FormatDate(new Date(), "datetime", true);
    createParkingCarVisible.value = true;
};

// 确认添加
const confirmCreateParkingCar = () => {
    console.log(createParkingCarFrom);
    http.post("/inOutRecord", createParkingCarFrom)
        .then((res: any) => {
            if (res.statusCode === SAVE_ERR) {
                ElMessage.error("添加失败");
            } else if (res.statusCode === LOGIN_ERR) {
                ElMessage.warning("授权信息过期，请重新登录");
                router.push("/login");
            } else {
                ElMessage.success("添加成功");
                createParkingCarVisible.value = false;
                getParkingCar();
            }
        })
        .catch(() => {
            ElMessage.error("添加失败");
        });
};

// 车辆出场 确认对话框
const outParkingCar = (parkingCarForm: UpdateParkingCar) => {
    ElMessageBox.confirm(
        "此操作将记录该车辆的出场时间隐藏显示，是否继续？",
        "警告",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            parkingCarForm.out_time = FormatDate(new Date(), "datetime", true);
            parkingCarForm.in_time = FormatDate(
                new Date(parkingCarForm.in_time),
                "datetime",
                true
            );
            http.put("/inOutRecord", parkingCarForm)
                .then((res: any) => {
                    if (res.statusCode === UPDATE_ERR) {
                        ElMessage.error("出场失败");
                    } else if (res.statusCode === LOGIN_ERR) {
                        ElMessage.warning("授权信息过期，请重新登录");
                        router.push("/login");
                    } else {
                        ElMessage.success("出场成功");
                        console.log("111")
                        getParkingCar();
                    }
                })
                .catch(() => {
                    ElMessage.error("出场失败");
                });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消",
            });
        });
};

// 删除在停车辆 确认对话框
const deleteParkingCar = (id: number) => {
    ElMessageBox.confirm(
        "即将删除该车辆信息，此操作不可撤销，是否确认？",
        "警告",
        {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            http.delete(`/inOutRecord/${id}`)
                .then((res: any) => {
                    if (res.statusCode === DELETE_ERR) {
                        ElMessage.error("删除失败");
                    } else if (res.statusCode === LOGIN_ERR) {
                        ElMessage.warning("授权信息过期，请重新登录");
                        router.push("/login");
                    } else {
                        ElMessage.success("删除成功");
                        getParkingCar();
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
const getParkingCar = () => {
    http.get<ParkingRespon>("/inOutRecord")
        .then((res: ParkingRespon) => {
            if (res.statusCode === LOGIN_ERR) {
                ElMessage.warning("授权信息过期，请重新登录");
                router.push("/login");
            } else if (res.statusCode === GET_ERR) {
                ElMessage.error("网络繁忙，请稍后再试");
            } else {
                parkingCarData.value = readParkingCarData(res.data);
            }
        })
        .catch(() => {
            ElMessage.error("网络繁忙，请稍后再试");
        });
};

// 过滤已出场车辆
const readParkingCarData = (data: ParkingCarData[]) => {
    const result = [];
    for (const item of data) {
        if (item.out_time == null) {
            result.push(item);
        }
    }
    return result;
};

getParkingCar();
</script>

<style scoped>
.table_area {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
