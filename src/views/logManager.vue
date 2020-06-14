<template>
  <div class="log-manager">
    <div class="tools-wrapper">
      <el-select class="search-type" v-model="selectType">
        <el-option
          v-for="item in searchType"
          :value="item.value"
          :key="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-input placeholder="请填写查询内容" v-model="searchText" class="search-input">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
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
        <el-table-column prop="number" label="时间"></el-table-column>
        <el-table-column prop="number" label="设备号"></el-table-column>
        <el-table-column prop="number" label="使用人"></el-table-column>
        <el-table-column prop="number" label="开机时间"></el-table-column>
        <el-table-column prop="number" label="关机时间"></el-table-column>
        <el-table-column prop="number" label="使用区域"></el-table-column>
        <el-table-column prop="status" label="使用路线">
          <template slot-scope="scope">
            <el-popover placement="left" width="800" trigger="click">
              <div id="map-view" class="map-view">{{scope.number}}</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 end-->
    </div>
    <div class="foot-wrapper">
      <!-- 分页 begin-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagesInfo.current"
        :page-size="pagesInfo.size"
        layout="total, prev, pager, next, jumper"
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
  name: "CloudAction",
  data() {
    return {
      tableMaxHeight: 0,
      multipleSelection: [],
      searchType: [
        { value: "deviceNo", name: "设备号码" },
        { value: "address", name: "区域" }
      ],
      selectType: "deviceNo",
      searchText: "",
      pagesInfo: {
        current: 1,
        total: 400,
        size: 100
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
    this.getTableData();
    this.$nextTick(() => {
      // table max-height不支持百分比，采用获取外层div高度赋值
      this.tableMaxHeight = this.$refs.tableRef.offsetHeight;
    });
  },
  methods: {
    //打开音频
    openAudio(value) {},
    //打开视频
    openVideo(value) {},
    //表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("this.multipleSelection", this.multipleSelection);
    },
    //关闭弹窗
    popClose() {
      this.popVisible = false;
    },
    //弹窗传来数据
    getPopData(val) {
      this.popVisible = false;
      console.log(2323233, val);
    },
    //导出
    importFunc() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择至少一条记录导出！",
          type: "warning"
        });
      } else {
        //导出excel
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getTableData() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data[this.selectType] = this.searchText;
      }
      xmlRequest({
        url: "/api/hel/log/list",
        data,
        success: data => {
          this.$set(this._data, "tableData", data);
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.log-manager {
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
  .search-type {
    width: 105px;
  }
}
</style>
