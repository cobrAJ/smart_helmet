<template>
  <div class="device-manager">
    <div class="tools-wrapper">
      <el-input
        placeholder="请输入相关信息进行查询"
        v-model="searchText"
        class="search-input"
        @keyup.enter.native="getTableList"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="getTableList"
        ></i>
      </el-input>
      <el-button
        type="primary"
        plain
        icon="el-icon-download"
        @click="importFunc"
        >导出</el-button
      >
    </div>
    <div class="table-wrapper" ref="tableRef">
      <!-- 表格 begin-->
      <el-table
        :data="tableData"
        :max-height="tableMaxHeight"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          label="全选"
        ></el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="address" label="地点"></el-table-column>
        <el-table-column prop="applyPersonId" label="申请人"></el-table-column>
        <el-table-column label="通话号码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phoneNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="callForm" :label="'通话方式\n(语音、视频)'">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.callForm == 0"
              >音频</el-tag
            >
            <el-tag size="small" v-if="scope.row.callForm == 1">视频</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="callDuration" label="通话时间"></el-table-column>
        <el-table-column prop="callRecord" label="通话记录">
          <template slot-scope="scope">
            <!-- 视频弹出层 begin-->
            <el-popover
              v-if="scope.row.status == 'video'"
              placement="left"
              width="800"
              trigger="click"
            >
              <!-- <video
                src="http://vjs.zencdn.net/v/oceans.mp4"
                controls="controls"
                autoplay
                height="auto"
                width="100%"
              >
                您的浏览器不支持。
              </video> -->
              <i
                slot="reference"
                class="el-icon-camera-solid"
                style="font-size: 20px; color: #409eff"
                @click="openVideo(scope.row)"
              ></i>
            </el-popover>
            <!-- 视频弹出层 end-->
            <!-- 音频弹出层 begin-->
            <i
              v-if="scope.row.status == 'audio'"
              slot="reference"
              class="el-icon-microphone"
              style="font-size: 20px; color: #409eff"
              @click="openAudio(scope.row)"
            ></i>
            <i
              v-if="scope.row.status == 'audio'"
              slot="reference"
              class="el-icon-turn-off-microphone"
              style="font-size: 20px; color: #409eff"
              @click="closeAudio(scope.row)"
            ></i>
            <!-- <el-popover
              v-if="scope.row.status == 'audio'"
              placement="left"
              width="330"
              trigger="click"
            >
              <audio src controls="controls" width="100%"></audio>
            </el-popover> -->

            <!-- 音频弹出层 end-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 end-->
    </div>
    <div class="foot-wrapper">
      <!-- 分页 begin-->
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :current-page="pagesInfo.current"
        :page-size="pagesInfo.size"
        :total="pagesInfo.total"
      ></el-pagination>
      <!-- 分页 end-->
    </div>

    <!-- 新增弹窗 begin-->
    <Dialog
      v-if="popVisible"
      :popData="popData"
      @popClose="popClose"
      @getPopData="getPopData"
    />
    <!-- 新增弹窗 end-->
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
import { xmlRequest } from "../utils/utils";

export default {
  name: "CloudAction",
  data() {
    return {
      tableMaxHeight: 0,
      multipleSelection: [],
      searchText: "",
      pagesInfo: {
        current: 1,
        total: 400,
        size: 10,
      },
      tableData: [
        {
          applyPersonId: "张三",
          date: "2016-05-03",
          phoneNum: "11111",
          status: "video",
          setting: true,
        },
        {
          applyPersonId: "李四",
          date: "2016-05-03",
          phoneNum: "11112",
          status: "audio",
          setting: true,
        },
        {
          applyPersonId: "王武",
          date: "2016-05-03",
          phoneNum: "11113",
          status: "audio",
          setting: true,
        },
      ],
      popVisible: false,
      popData: {},
    };
  },
  components: {
    Dialog,
  },
  created() {},
  mounted() {
    if (!window.oSipStack) {
      sipRegister();
    }
    window.onload = () => {
      if (!window.oSipStack) {
        sipRegister();
      }
    };
    this.$nextTick(() => {
      // table max-height不支持百分比，采用获取外层div高度赋值
      this.tableMaxHeight = this.$refs.tableRef.offsetHeight;
    });
    this.getTableList();
  },
  methods: {
    // 导出
    outExe() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.dataList; //你要导出的数据list。
          this.export2Excel();
        })
        .catch(() => {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("../excel/Export2Excel"); //这里必须使用绝对路径
        const tHeader = [
          "时间",
          "地点",
          "申请人",
          "通话人",
          "通话方式(语音、视频)",
          "通话时间",
          "通话记录",
        ]; // 导出的表头名
        const filterVal = [
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
        ]; // 导出的表头字段名
        const list = that.multipleSelection; //所选表格行数据
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "云指导excel"); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    //获取表格数据
    getTableList() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data.keyword = this.searchText;
      }
      // console.log("data", data);
      xmlRequest({
        url: "/api/hel/record/list",
        data,
        success: (data) => {
          if (data.data.records.length != 0) {
            this.$set(this._data, "tableData", data.data.records);
          }
          this.$set(this.pagesInfo, "current", data.data.current);
          this.$set(this.pagesInfo, "size", data.data.size);
          this.$set(this.pagesInfo, "total", data.data.total);
        },
      });
    },
    //打开音频
    openAudio(value) {
      // console.log(value);
      window.txtPhoneNumber.value = value.phoneNum;
      sipCall("call-audio");
    },
    //关闭音频
    closeAudio(value) {
      sipHangUp();
    },
    //打开视频
    openVideo(value) {},
    //表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log("this.multipleSelection", this.multipleSelection);
    },
    //关闭弹窗
    popClose() {
      this.popVisible = false;
    },
    //弹窗传来数据
    getPopData(val) {
      this.popVisible = false;
      // console.log(2323233, val);
    },
    //导出
    importFunc() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择至少一条记录导出！",
          type: "warning",
        });
      } else {
        //导出excel
        this.outExe();
      }
    },
    //切换每页显示条数
    handleSizeChange(val) {
      this.pagesInfo.size = val;
      this.getTableList();
      // console.log(`每页 ${val} 条`);
    },
    //当前页数
    handleCurrentChange(val) {
      this.pagesInfo.current = val;
      this.getTableList();
    },
  },
};
</script>

<style lang='less' scoped>
.device-manager {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .fixed {
    display: flex;
    justify-content: space-between;
    .el-form-item {
      width: 45%;
    }
  }
  .tools-wrapper {
    height: 40px;
    display: flex;
    margin-bottom: 30px;
    .search-input {
      width: 300px;
      margin-right: 50px;
    }
  }
  .table-wrapper {
    flex: 1;
  }
  .foot-wrapper {
    height: 40px;
  }
  .unshow {
    display: none;
  }
}
</style>
