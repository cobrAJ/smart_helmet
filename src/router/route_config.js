import Login from "../views/Login.vue";

let nextChildrenRoute = [
    {
        path: "organizationManagement",
        name: "organizationManagement",
        component: () => import("../views/organizationManagement.vue"),
        description: "组织管理",
    },
    {
        path: "administratorManagement",
        name: "administratorManagement",
        component: () => import("../views/administratorManagement.vue"),
        description: "管理员管理",
    },
    {
        path: "deviceManager",
        name: "deviceManager",
        component: () => import("../views/deviceManager.vue"),
        description: "设备管理",
    },
]
let childrenRoute = [
    {
        path: "logManager",
        name: "logManager",
        component: () => import("../views/logManager.vue"),
        description: "日志管理",
    },
    {
        path: "cloudAction",
        name: "cloudAction",
        component: () => import("../views/cloudAction.vue"),
        description: "云指导",
    },
    {
        path: "waringManager",
        name: "waringManager",
        component: () => import("../views/waringManager.vue"),
        description: "告警管理",
    },
    {
        path: "totalManager",
        name: "totalManager",
        redirect: "/home/totalManager/organizationManagement",
        description: "管理",
        children: nextChildrenRoute
    },
    {
        path: "mapView",
        name: "mapView",
        component: () => import("../views/mapView.vue"),
        description: "返回地图",
    },
    // {
    //     path: "systemManager",
    //     name: "systemManager",
    //     component: () => import("../views/systemManager.vue"),
    //     description: "设置",
    // },
];

let defaultRoute = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/home",
        name: "home",
        component: () => import("../views/Home.vue"),
        children: childrenRoute
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/404.vue")
    }
];

export { defaultRoute, childrenRoute, nextChildrenRoute };