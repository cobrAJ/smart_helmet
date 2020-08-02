<template>
  <div class="map-view">
    <div class="search-area">
      <el-input v-model="searchValue" placeholder="输入设备号/工号查询">
        <el-button slot="append" icon="el-icon-search" @click="searchDevice"></el-button>
      </el-input>
    </div>
    <div id="map-view"></div>
    <div class="device-navigate">
      <a @click="linkTo('/home/totalManager')">
        <img src="static/config.png" alt />
      </a>
      <a @click="linkTo('/home/waringManager')">
        <img src="static/warning.png" alt />
      </a>
      <a @click="linkTo('/home/cloudAction')">
        <img src="static/cloudwork.png" alt />
      </a>
      <a @click="linkTo('/home/logManager')">
        <img src="static/document.png" alt />
      </a>
    </div>
    <div class="device-info">
      <div>总数：{{256}}</div>
      <div>在线：{{256}}</div>
      <div>离线：{{256}}</div>
    </div>
  </div>
</template>

<script>
import markIcon from "../assets/mark.png";
import warningMarkIcon from "../assets/warning_mark.png";
import { xmlRequest } from "../utils/utils";

export default {
  data() {
    let helmetPointListOrigin = [
      { lng: 116.362209, lat: 39.887487, type: "normal", userid: "1" },
      { lng: 116.422897, lat: 39.878002, type: "waring", userid: "2" },
      { lng: 116.372105, lat: 39.90651, type: "normal", userid: "3" },
      { lng: 116.428945, lat: 39.89663, type: "normal", userid: "4" },
    ];
    let helmetPointList = JSON.parse(JSON.stringify(helmetPointListOrigin));
    return {
      mapModel: "",
      helmetPointListOrigin,
      helmetPointList,
      infoWindow: "",
      searchValue: "",
      selectDeviceUserid: "",
    };
  },
  methods: {
    searchDevice() {
      if (this.searchValue) {
        xmlRequest({
          url: "/api/hel/device/list",
          data: {
            keyword: this.searchValue,
          },
          success: (data) => {
            this.helmetPointList = data.data.records;
            this.helmetPointList.map((item) => this.createMark(item));
          },
        });
      } else {
        this.helmetPointList = JSON.parse(
          JSON.stringify(this.helmetPointListOrigin)
        );
        this.helmetPointList.map((item) => this.createMark(item));
      }
    },
    linkTo(target) {
      this.$router.push(target);
    },
    initMap() {
      this.mapModel = new AMap.Map("map-view");
      this.mapModel.on("complete", () => {
        this.mapModel.add(
          this.helmetPointList.map((item) => this.createMark(item))
        );
      });
      this.createInfoWindow();
    },
    createMark(markPoint) {
      let newMark = new AMap.Marker({
        position: new AMap.LngLat(markPoint.lng, markPoint.lat),
        imageSize: new AMap.Size(40, 50),
        imageOffset: new AMap.Pixel(-9, -3),
        icon: this.createIcon(markPoint),
        size: new AMap.Size(40, 50),
        offset: new AMap.Pixel(-20, 0),
      });
      let that = this;
      AMap.Event.addListener(newMark, "click", function () {
        that.infoWindow.open(that.mapModel, newMark.getPosition());
        that.selectDeviceUserid = markPoint.userid;
      });
      return newMark;
    },
    createIcon(markPoint) {
      return new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: markPoint.type == "normal" ? markIcon : warningMarkIcon, // Icon的图像
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(40, 50), // 根据所设置的大小拉伸或压缩图片
      });
    },
    createInfoWindow() {
      var content =
        "<ul class='open-tips'>" +
        "<li><div><img src='static/camera.png' />摄像拍照</div></li>" +
        "<li><div><img src='static/mic.png' />语音对讲</div></li>" +
        "<li><div><img src='static/video.png' />视频对讲</div></li>" +
        "<li><div><img src='static/light.png' />紧急报警</div></li>" +
        "<li><div><img src='static/user.png' />佩戴人员</div></li></ul>";
      // 创建 infoWindow 实例
      this.infoWindow = new AMap.InfoWindow({
        content: content, //传入 dom 对象，或者 html 字符串
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
};
</script>

<style>
.map-view,
#map-view {
  height: 100%;
}

.device-info {
  width: 110px;
  position: fixed;
  right: 20px;
  bottom: 30px;
  background: white;
  padding: 5px;
  opacity: 0.8;
}

.search-area {
  width: 300px;
  position: fixed;
  left: 40px;
  z-index: 1;
  top: 40px;
}

.open-tips {
  padding: 10px;
  text-align: center;
}

.open-tips li {
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #dddddd;
  padding: 8px 0px;
}

.open-tips li:hover {
  background: #dddddd;
}

.open-tips img {
  height: 20px;
  margin-right: 10px;
  vertical-align: bottom;
}
.device-navigate {
  position: fixed;
  top: 30%;
  right: 30px;
  z-index: 1;
}
.device-navigate > a {
  display: block;
  margin-bottom: 15px;
  background: white;
  border-radius: 3px;
  box-shadow: 1px 1px 1px 1px #dddddd;
}

.device-navigate > a img {
  width: 30px;
}
</style>
