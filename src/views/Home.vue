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
    </el-header>
    <el-container class="home-content">
      <el-aside width="250px">Aside</el-aside>
      <el-main>
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import defaultRoute from "../router/route_config.js";
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
      defaultRoute,
      activeIndex
    };
  },
  methods: {
    linkTo(path) {
      location.hash = "#/home/" + path;
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
    .logo-wrapper {
      height:100%;
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
    .el-aside {
      border-right: 1px solid #cdcdcd;
      padding: 40px 0;
      height: 100%;
    }
    .el-main {
      flex: 1;
      padding: 20px 20px;
      height: 100%;
      .content-wrapper {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 20px;
      }
    }
  }
}
</style>