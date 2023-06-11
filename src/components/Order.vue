<template>
  <h1>订单信息</h1>
  <div style="margin: 0 30px 0 30px">
    <div>
      <div>
        <el-button type="primary" text @click="createOrderVisible = true"
          >添加订单信息</el-button
        >
      </div>
      <br />
      <div>
        <el-input
          v-model="searchVisitorData.status"
          placeholder="请输入需要查找的车牌号"
          style="width: 200px"
          autocomplete="off"
        />
        <el-button type="primary" text @click="searchVisitor">查询</el-button>
        <el-button type="primary" text @click="resetSearch">重置</el-button>
      </div>
      <br />
    </div>
    <div class="table_area">
      <el-table :data="OrderData" stripe style="width: 100%">
        <el-table-column prop="carNumber" label="车牌号" width="180" />
        <el-table-column prop="parkingTime" label="时长" width="180" />
        <el-table-column prop="money" label="价格(￥)" width="180" />
        <el-table-column prop="status" label="状态" width="160" />
        <el-table-column label="操作" width="152">
          <template #default="{ row }">
            <el-button type="primary" text @click="showEditOrderModel(row)"
              >修改</el-button
            >
            <el-button type="primary" text @click="deleteOrder(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="editOrderVisible" title="修改订单信息">
    <el-form :model="editOrderFrom">
      <el-form-item label="订单ID" :label-width="120">
        <el-input v-model="editOrderFrom.id" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="车牌号" :label-width="120">
        <el-input v-model="editOrderFrom.carNumber"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="120">
        <el-input v-model="editOrderFrom.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="停车时长" :label-width="120">
        <el-input
          @change="calcMoney2"
          v-model="editOrderFrom.parkingTime"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="费用" :label-width="120">
        <el-input v-model="editOrderFrom.money" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="订单状态" :label-width="120">
        <el-select v-model="editOrderFrom.status">
          <el-option value="未付款">未付款</el-option>
          <el-option value="已付款">已付款</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editOrderVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditOrder"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="createOrderVisible" title="添加订单信息">
    <el-form :model="createOrderFrom">
      <el-form-item label="电话" :label-width="120">
        <el-input v-model="createOrderFrom.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="车牌号" :label-width="120">
        <el-input v-model="createOrderFrom.carNumber"></el-input>
      </el-form-item>

      <el-form-item label="停车时长" :label-width="120">
        <el-input
          @change="calcMoney1"
          v-model="createOrderFrom.parkingTime"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="费用" :label-width="120">
        <el-input v-model="createOrderFrom.money" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="订单状态" :label-width="120">
        <el-select v-model="createOrderFrom.status">
          <el-option value="未付款">未付款</el-option>
          <el-option value="已付款">已付款</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createOrderVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateOrder"> 确定 </el-button>
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
  UpdateOrder,
  CreateOrder,
  VisitorRequest,
  OrderData,
} from "../types/Order";
import router from "../router";

const OrderData = ref<OrderData[]>();
const editOrderVisible = ref<boolean>(false);
const createOrderVisible = ref<boolean>(false);
const editOrderFrom = reactive<UpdateOrder>({
  id: 0,
  phone: "",
  carNumber: "",
  status: "",
  money: 0,
  parkingTime: 0,
});
const createOrderFrom = reactive<CreateOrder>({
  phone: "",
  carNumber: "",
  status: "未付款",
  money: 0,
  parkingTime: 0,
});
const searchVisitorData = ref<OrderData>({
  id: null,
  phone: "",
  carNumber: "",
  status: "",
  money: 0,
  parkingTime: 0,
  value: {
    id: null,
    phone: "",
    carNumber: "",
    status: "",
  },
});

// 重置查询信息
const resetSearch = () => {
  searchVisitorData.value = {
    id: null,
    phone: "",
    carNumber: "",
    status: "",
    money: 0,
    parkingTime: 0,
    value: {
      id: null,
      phone: "",
      carNumber: "",
      status: "",
    },
  };
  getOrder();
};

// 查找订单信息
const searchVisitor = () => {
  const params = {
    status: searchVisitorData.value.status,
  };
  http
    .get(`/order/${params.status}`)
    .then((res: any) => {
      if (res.statusCode === GET_ERR) {
        ElMessage.error("未查询到相关订单信息");
      } else if (res.statusCode === LOGIN_ERR) {
        router.push("/login");
      } else {
        OrderData.value = res.data;
      }
    })
    .catch(() => {
      ElMessage.error("未查询到相关订单信息");
    });
};

const showEditOrderModel = (Order: UpdateOrder) => {
  editOrderFrom.id = Order.id;
  editOrderFrom.phone = Order.phone;
  editOrderFrom.carNumber = Order.carNumber;
  editOrderFrom.status = Order.status;
  editOrderFrom.parkingTime = Order.parkingTime;
  editOrderFrom.money = Order.money;
  editOrderVisible.value = true;
};

// 确认修改
const calcMoney1 = () => {
  createOrderFrom.money = createOrderFrom.parkingTime * 5;
};
const calcMoney2 = () => {
  editOrderFrom.money = editOrderFrom.parkingTime * 5;
};
// 确认修改
const confirmEditOrder = () => {
  http
    .put("/order", editOrderFrom)
    .then((res: any) => {
      if (res.statusCode === UPDATE_ERR) {
        ElMessage.error("修改失败");
      } else if (res.statusCode === LOGIN_ERR) {
        router.push("/login");
      } else {
        ElMessage.success("修改成功");
        editOrderVisible.value = false;
        getOrder();
      }
    })
    .catch(() => {
      ElMessage.error("添加失败");
    });
};

// 确认添加
const confirmCreateOrder = () => {
  console.log(createOrderFrom);
  http
    .post("/order", createOrderFrom)
    .then((res: any) => {
      if (res.statusCode === SAVE_ERR) {
        ElMessage.error("添加失败");
      } else if (res.statusCode === LOGIN_ERR) {
        router.push("/login");
      } else {
        ElMessage.success("添加成功");
        createOrderVisible.value = false;
        getOrder();
      }
    })
    .catch(() => {
      ElMessage.error("添加失败");
    });
};

// 删除订单信息 确认对话框
const deleteOrder = (id: number) => {
  ElMessageBox.confirm(
    "即将删除该订单信息，此操作不可撤销，是否确认？",
    "警告",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      http
        .delete(`/order/${id}`)
        .then((res: any) => {
          if (res.statusCode === DELETE_ERR) {
            ElMessage.error(res.msg);
          } else if (res.statusCode === LOGIN_ERR) {
            router.push("/login");
          } else {
            ElMessage.success("删除成功");
            getOrder();
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
const getOrder = () => {
  http
    .get<VisitorRequest>("/order")
    .then((res: VisitorRequest) => {
      if (res.statusCode === LOGIN_ERR) {
        router.push("/login");
      } else if (res.statusCode === GET_ERR) {
        ElMessage.error("网络繁忙，请稍后再试");
      } else {
        OrderData.value = res.data;
      }
    })
    .catch(() => {
      ElMessage.error("网络繁忙，请稍后再试");
    });
};

getOrder();
</script>

<style scoped>
.table_area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
