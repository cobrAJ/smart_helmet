<template>
  <div class="device-manager">
    <div class="tools-wrapper">
      <el-input
        placeholder="请输入相关信息进行查询"
        v-model="searchText"
        class="search-input"
        @keyup.enter.native="getTableList"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getTableList"></i>
      </el-input>
      <el-button type="primary" plain icon="el-icon-download" @click="importFunc">导出</el-button>
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
        <el-table-column type="selection" width="55" label="全选"></el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="deviceId" label="设备号"></el-table-column>
        <el-table-column prop="userId" label="使用人"></el-table-column>
        <el-table-column prop="warnContent" :label="'告警内容 \n设备告警/路线告警'"></el-table-column>
      </el-table>
      <!-- 表格 end-->
    </div>
    <div class="foot-wrapper">
      <!-- 分页 begin-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes, prev, pager, next"
        :current-page="pagesInfo.current"
        :page-size="pagesInfo.size"
        :total="pagesInfo.total"
      ></el-pagination>
      <!-- 分页 end-->
    </div>

    <!-- 新增弹窗 begin-->
    <Dialog v-if="popVisible" :popData="popData" @popClose="popClose" @getPopData="getPopData" />
    <!-- 新增弹窗 end-->
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
import { xmlRequest } from "../utils/utils";
export default {
  name: "WarningManager",
  data() {
    return {
      tableMaxHeight: 0,
      multipleSelection: [],
      searchText: "",
      pagesInfo: {
        current: 1,
        total: 400,
        size: 10
      },
      tableData: [
        {
          date: "2016-05-03",
          number: "11111",
          status: "video",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "audio",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "audio",
          setting: true
        }
      ],
      popVisible: false,
      popData: {}
    };
  },
  components: {
    Dialog
  },
  created() {},
  mounted() {
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
        type: "warning"
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
          "设备号",
          "使用人",
          "告警内容（设备告警/路线告警）"
        ]; // 导出的表头名
        const filterVal = ["number", "number", "number", "number"]; // 导出的表头字段名
        const list = that.multipleSelection; //所选表格行数据
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "告警管理excel"); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    //获取表格数据
    getTableList() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data.keyword = this.searchText;
      }
      // console.log("data", data);
      xmlRequest({
        url: "/api/hel/warning/list",
        data,
        success: data => {
          this.$set(this.pagesInfo, "total", data.data.total);
          this.$set(this._data, "tableData", data.data.records);
        }
      });
    },
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
          type: "warning"
        });
      } else {
        //导出
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
      // console.log(`当前页: ${val}`);
    }
  }
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
}
</style>
