<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { defaultRoute, childrenRoute } from "./router/route_config.js";
import route from "./router/";
import { sstCtrl, cookieCtrl } from "./utils/utils";
import $vm from "./main";

route.beforeEach((to, from, next) => {
  /*  1 首先判断要去的to.name 在routeconfig中是否有声明，
  如果有就去获取是否登陆了，如果是登陆或者是去登录页不拦截，反之指向登录页 */
  let sstLogin = sstCtrl.getItem(location.host) || false;
  let cookieLogin = cookieCtrl.getCookie(location.host) || false;
  if (sstLogin || cookieLogin) {
    if (to.name) {
      /* to.name判断是一级路由有无声明  */
      if (to.name == "login" || to.name == "404") {
        next();
      } else {
        if (childrenRoute.filter(item => item.name == to.name).length != 0) {
          next();
        } else {
          $vm.$message({
            type: "warning",
            message: "no permitted"
          });
        }
      }
    } else {
      route.push("/404");
    }
  } else {
    if (to.name != "login") {
      route.push("/login");
    } else {
      next();
    }
  }
});
export default {
  name: "App",
  data() {
    return {
      routes: defaultRoute
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
