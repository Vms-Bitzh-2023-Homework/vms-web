// 导入vue-router路由组件
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

// 导入相关组件
import ParkingCarVue from "../components/ParkingCar.vue";
import LayoutPage from "../pages/LayoutPage.vue";
import LoginPageVue from "../pages/LoginPage.vue";
import VisitorInfoVue from "../components/VisitorInfo.vue";
import ParkcarInfoVue from "../components/ParkcarInfo.vue";
import HomeVue from "../components/Home.vue";
import OrderVue from "../components/Order.vue";
import UserInfoVue from "../components/UserInfo.vue";
import AddUserVue from "../components/AddUser.vue";
import InOutRecordVue from "../components/InOutRecord.vue";

// 配置路由
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/layout",
    },
    {
        path: "/login",
        name: "login",
        component: () => LoginPageVue,
        meta: { title: "登录" },
    },
    {
        path: "/layout",
        name: "layout",
        redirect: "/home",
        component: LayoutPage,
        children: [
            {
                path: "/home",
                name: "home",
                component: HomeVue,
                meta: {
                    title: "主页",
                },
            },
            {
                path: "/parkingCar",
                name: "parkingCar",
                component: ParkingCarVue,
                meta: { title: "在停车辆信息" },
            },
            {
                path: "/visitorInfo",
                name: "visitorInfo",
                component: VisitorInfoVue,
                meta: { title: "车主信息" },
            },
            {
                path: "/parkcarInfo",
                name: "parkcarInfo",
                component: ParkcarInfoVue,
                meta: { title: "车库信息" },
            },
            {
                path: "/order",
                name: "order",
                component: OrderVue,
                meta: { title: "订单信息" },
            },
            {
                path: "/userInfo",
                name: "userInfo",
                component: UserInfoVue,
                meta: { title: "个人中心" },
            },
            {
                path: "/addUser",
                name: "addUser",
                component: AddUserVue,
                meta: { title: "添加用户" },
            },
            {
                path: "/InOutRecord",
                name: "InOutRecord",
                component: InOutRecordVue,
                meta: { title: "出入场信息" },
            },
        ],
    },
];

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path != "/login") {
        if (!localStorage.getItem("token")) {
            ElMessage.error("尚未登录，请登录后再试");
            router.replace("/login");
        }
    }
    if (to.path == "/addUser") {
        const role = JSON.parse(
            atob(localStorage.getItem("token")?.split(".")[1] as string)
        ).perms;
        if (role != "admin") {
            ElMessage.error("权限不足");
            router.replace(from.path);
        }
    }
    document.title = to.meta.title as string;
    next();
});

export default router;
