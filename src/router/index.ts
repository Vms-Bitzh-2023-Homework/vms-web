// 导入vue-router路由组件
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

// 导入相关组件
import ParkingCarVue from "../components/ParkingCar.vue";
import LayoutPage from "../pages/LayoutPage.vue";
import LoginPageVue from "../pages/LoginPage.vue";
import VisitorInfoVue from "../components/VisitorInfo.vue";
import HomeVue from "../components/Home.vue";

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
        meta: { title: "", icon: "" },
    },
    {
        path: "/layout",
        name: "layout",
        component: LayoutPage,
        children: [
            {
                path: "/home",
                name: "home",
                component: HomeVue,
            },
            {
                path: "/parkingCar",
                name: "parkingCar",
                component: ParkingCarVue,
            },
            {
                path: "/visitorInfo",
                name: "visitorInfo",
                component: VisitorInfoVue,
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
    next();
});

export default router;
