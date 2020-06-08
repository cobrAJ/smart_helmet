<template>
  <el-container class="home">
    <el-header class="home-header">
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
      <el-aside width="250px">
        <LeftBar :treeData="treeData" @getSelectNode="getSelectNode"></LeftBar>
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
import defaultRoute from "../router/route_config.js";
import LeftBar from "@/components/LeftBar.vue";
import Dialog from "@/components/Dialog.vue";
export default {
  data() {
    let activeIndex = "mapView";
    let index = location.hash.lastIndexOf("/") + 1;
    let tmp = location.hash.substr(index);
    if (location.hash.split("/").length > 2 && tmp) {
      activeIndex = tmp;
    }
    console.log(activeIndex);
    return {
      popVisible: false,
      popData: {},
      defaultRoute,
      activeIndex,
      treeData: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
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
      console.log(2323233, val);
    },
    //修改密码弹窗
    changePassword() {
      this.popVisible = true;
      this.popData = {
        title: "修改密码",
        type: "changePassword",
        formData: {
          name: "",
          oldPassword: "",
          password: "",
          confirmPassword: ""
        }
      };
    },
    //退出登录
    loginOut() {
      this.$router.push({
        path: "/login"
      });
    },
    linkTo(path) {
      location.hash = "#/home/" + path;
    },
    //获取当前选中树节点
    getSelectNode(val) {
      console.log("val", val);
    }
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
    .header-right {
      height: 100%;
      position: absolute;
      right: 30px;
      top: 0;
      z-index: 9;
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