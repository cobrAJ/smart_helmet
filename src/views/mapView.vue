<template>
  <div id="map-view" class="map-view"></div>
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
      ]
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
    },
    createMark(markPoint) {
      return new AMap.Marker({
        position: new AMap.LngLat(markPoint.lng, markPoint.lat),
        imageSize: new AMap.Size(40, 50),
        imageOffset: new AMap.Pixel(-9, -3),
        icon: this.createIcon(markPoint),
        size: new AMap.Size(40, 50)
      });
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
      var content = [];

      // 创建 infoWindow 实例
      var infoWindow = new AMap.InfoWindow({
        content: content.join("<br>") //传入 dom 对象，或者 html 字符串
      });

      // 打开信息窗体
      infoWindow.open(map);
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
.map-view {
  height: 100%;
}
</style>
