<template>
  <el-container class="home">
    <el-header v-if="this.$route.path != '/home/mapView'" class="home-header">
      <div>
        <div class="logo-wrapper">
          <img src="../assets/logo.png" />
          <span>智能头盔管理平台</span>
        </div>
        <el-menu
          :default-active="activeIndex"
          background-color="#1e2b3e"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-demo"
          mode="horizontal"
        >
          <el-menu-item
            v-for="(childItem,ckey) in defaultRoute[2].children"
            :key="ckey"
            :index="childItem.path"
            @click="linkTo(childItem.path)"
          >{{childItem.description}}</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <div @click="changePassword">
          <i class="el-icon-edit"></i>修改密码
        </div>
        <div @click="loginOut">
          <i class="el-icon-switch-button"></i>退出登录
        </div>
      </div>
    </el-header>
    <el-container class="home-content">
      <el-aside v-if="this.$route.path != '/home/mapView'" width="250px">
        <LeftBar v-if="treeData.length != 0" :treeData="treeData" @getSelectNode="getSelectNode"></LeftBar>
      </el-aside>
      <el-main>
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
    <!-- 修改密码弹窗 -->
    <Dialog v-if="popVisible" :popData="popData" @popClose="popClose" @getPopData="getPopData" />
  </el-container>
</template>

<script>
import { defaultRoute } from "../router/route_config.js";
import LeftBar from "@/components/LeftBar.vue";
import Dialog from "@/components/Dialog.vue";
import { sstCtrl, cookieCtrl, xmlRequest } from "../utils/utils";

export default {
  data() {
    let activeIndex = "mapView";
    let index = location.hash.lastIndexOf("/") + 1;
    let tmp = location.hash.substr(index);
    if (location.hash.split("/").length > 2 && tmp) {
      activeIndex = tmp;
    }
    // console.log(activeIndex);
    return {
      popVisible: false,
      popData: {},
      defaultRoute,
      activeIndex,
      treeData: []
    };
  },
  watch: {
    $route(now, old) {
      this.getOrgList();
      defaultRoute[2].children.forEach((item, index) => {
        if (
          item.name === now.name ||
          (item.name === "totalManager" &&
            now.name === "organizationManagement")
        ) {
          this.activeIndex = item.name;
        }
      });
    }
  },
  components: {
    LeftBar,
    Dialog
  },
  methods: {
    //关闭弹窗
    popClose() {
      this.popVisible = false;
    },
    //弹窗传来数据
    getPopData(val) {
      this.popVisible = false;
      // console.log(2323233, val);
    },
    //修改密码弹窗
    changePassword() {
      this.popVisible = true;
      this.popData = {
        title: "修改密码",
        type: "changePassword",
        formData: {
          name: localStorage.getItem("userName"),
          oldPassword: "",
          password: "",
          confirmPassword: ""
        }
      };
    },
    //退出登录
    loginOut() {
      sstCtrl.clearItem(location.host);
      cookieCtrl.delCookie(location.host);
      this.$router.push({
        path: "/login"
      });
    },
    linkTo(path) {
      this.$router.push("/home/" + path);
    },
    //获取当前选中树节点
    getSelectNode(val) {
      // console.log("val", val);
      // 管理跳转
      if (val.isTotalManager) {
        location.hash = "#/home/totalManager/" + val.path;
      }
    },
    //加载组织树
    getOrgList() {
      if (
        this.$route.name === "organizationManagement" ||
        this.$route.name === "administratorManagement" ||
        this.$route.name === "deviceManager"
      ) {
        let treeData = [
          {
            name: "组织管理",
            path: "organizationManagement",
            isTotalManager: true
          },
          {
            name: "管理员管理",
            path: "administratorManagement",
            isTotalManager: true
          },
          { name: "设备管理", path: "deviceManager", isTotalManager: true }
        ];
        this.$set(this._data, "treeData", treeData);
      } else {
        xmlRequest({
          url: "/api/sys/dept/list",
          success: data => {
            this.$set(this._data, "treeData", data);
          },
          error: e => {
            console.log(e);
            this.$set(this._data, "treeData", e);
          }
        });
      }
    }
  },
  mounted() {
    this.getOrgList();
  }
};
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .home-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    background-color: rgb(30, 43, 62);
    width: 100%;
    .header-right {
      height: 100%;
      // position: absolute;
      // right: 30px;
      // top: 0;
      padding-right: 30px;
      // z-index: 9;
      line-height: 60px;
      color: #fff;
      font-size: 14px;
      display: flex;
      div {
        margin-left: 15px;
      }
    }
    .logo-wrapper {
      height: 100%;
      position: absolute;
      left: 30px;
      top: 0;
      z-index: 9;
      line-height: 60px;
      img {
        width: 35px;
        margin-right: 10px;
      }
      span {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .home-content {
    flex: 1;
    display: flex;
    background-color: #f9f9fa;
    overflow: hidden;
    .el-aside {
      border-right: 1px solid #cdcdcd;
      padding: 40px 0;
      height: 100%;
      background: rgba(30, 43, 62, 0.95);
      color: #fff;
    }
    .el-main {
      flex: 1;
      padding: 20px 20px;
      height: 100%;
      overflow: hidden;
      .content-wrapper {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
      }
    }
  }
}
</style>