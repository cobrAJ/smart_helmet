<template>
  <div class="map-view">
    <div class="search-area">
      <el-input v-model="searchValue" placeholder="输入设备号/工号查询">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div id="map-view"></div>
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

export default {
  data() {
    return {
      mapModel: "",
      helmetPointList: [
        { lng: 116.362209, lat: 39.887487, type: "normal" },
        { lng: 116.422897, lat: 39.878002, type: "waring" },
        { lng: 116.372105, lat: 39.90651, type: "normal" },
        { lng: 116.428945, lat: 39.89663, type: "normal" }
      ],
      infoWindow: "",
      searchValue: ""
    };
  },
  methods: {
    initMap() {
      this.mapModel = new AMap.Map("map-view");
      this.mapModel.on("complete", () => {
        this.mapModel.add(
          this.helmetPointList.map(item => this.createMark(item))
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
        offset: new AMap.Pixel(-20, 0)
      });
      let that = this;
      console.log(AMap.Event.addListener);
      AMap.Event.addListener(newMark, "click", function() {
        that.infoWindow.open(that.mapModel, newMark.getPosition());
      });
      return newMark;
    },
    createIcon(markPoint) {
      return new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: markPoint.type == "normal" ? markIcon : warningMarkIcon, // Icon的图像
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(40, 50) // 根据所设置的大小拉伸或压缩图片
      });
    },
    createInfoWindow() {
      var content =
        "<ul class='open-tips'><li><div>摄像拍照</div></li><li><div>语音对讲</div></li><li><div>视频对讲</div></li><li><div>紧急报警</div></li><li><div>佩戴人员</div></li></ul>";
      // 创建 infoWindow 实例
      this.infoWindow = new AMap.InfoWindow({
        content: content //传入 dom 对象，或者 html 字符串
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  }
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
  left: 270px;
  z-index: 1;
  top: 80px;
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
</style>
