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
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="openPop('add')">新增</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="openPop('change')">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteFunc">删除</el-button>
      <el-button type="primary" plain icon="el-icon-download" @click="openPop('import')">导入数据</el-button>
      <!-- <el-button type="primary" plain icon="el-icon-circle-check" @click="openPop('binding')">绑定部门</el-button>
      <el-button type="primary" plain icon="el-icon-circle-close" @click="openPop('untie')">解绑部门</el-button> -->
      <el-button type="primary" plain icon="el-icon-camera" @click="openPop('setting')">摄像头设置</el-button>
    </div>
    <div class="table-wrapper" ref="tableRef">
      <el-table
        :data="tableData"
        border
        :max-height="tableMaxHeight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" label="全选"></el-table-column>
        <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
        <!-- <el-table-column prop="address" label="定位地址"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>-->
        <el-table-column prop="deptId" label="部门ID"></el-table-column>
        <el-table-column prop="lng" label="经度"></el-table-column>
        <el-table-column prop="lat" label="纬度"></el-table-column>
        <el-table-column prop="fourGNo" label="4G卡号"></el-table-column>
        <el-table-column prop="userId" label="使用人ID"></el-table-column>
        <el-table-column prop="status" label="设备状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 0">在线</el-tag>
            <el-tag size="small" v-if="scope.row.status == 1">关机</el-tag>
            <el-tag size="small" type="warning" v-if="scope.row.status == 2">告警</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="deviceType" label="设备类型">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.deviceType == 0">永久开启</el-tag>
            <el-tag size="small" v-if="scope.row.deviceType == 1">时段开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceStartTime" label="开始时间">
          <template slot-scope="scope">
            <div v-if="scope.row.deviceType == 0">-</div>
            <div v-else>{{scope.row.deviceStartTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceEndTime" label="结束时间">
          <template slot-scope="scope">
            <div v-if="scope.row.deviceType == 0">-</div>
            <div v-else>{{scope.row.deviceEndTime}}</div>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="foot-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes, prev, pager, next"
        :current-page="pagesInfo.current"
        :page-size="pagesInfo.size"
        :total="pagesInfo.total"
      ></el-pagination>
    </div>
    <!-- 新增弹窗 -->
    <Dialog v-if="popVisible" :popData="popData" @popClose="popClose" @getPopData="getPopData" />
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
import { xmlRequest } from "../utils/utils";
export default {
  name: "DeviceManager",
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
      tableData: [],
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
    //获取表格数据
    getTableList() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data.keyword = this.searchText;
      }
      // console.log("data", data);
      xmlRequest({
        url: "/api/hel/device/list",
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
      let data = val.formData;
      if (val.type == "add") {
        //新增接口
        xmlRequest({
          url: "/api/hel/device/save",
          data,
          success: data => {
            this.$message.success("保存成功");
            //刷新列表
            this.getTableList();
          }
        });
      } else if (val.type == "change") {
        //修改接口
        xmlRequest({
          url: "/api/hel/device/update",
          data,
          success: data => {
            this.$message.success("修改成功");
            //刷新列表
            this.getTableList();
          }
        });
      }
    },
    //打开弹窗
    openPop(type) {
      if (
        this.multipleSelection.length == 0 &&
        type != "add" &&
        type != "import"
      ) {
        this.$message({
          message: "请选择一条记录",
          type: "warning"
        });
      } else if (
        this.multipleSelection.length > 1 &&
        type != "add" &&
        type != "import"
      ) {
        this.$message({
          message: "只能选择一条记录",
          type: "warning"
        });
      } else {
        this.popVisible = true;
        if (type == "add") {
          //新增
          this.popData = {
            title: "新增",
            type: type,
            formData: {
              address: "",
              createTime: "",
              deptId: 0,
              deviceEndTime: "",
              deviceNo: "",
              deviceStartTime: "",
              deviceType: 0,
              fourGNo: "",
              id: 0,
              lat: 0,
              lng: 0,
              status: 0,
              userId: 0
            }
          };
        } else if (type == "change") {
          //修改
          this.popData = {
            title: "修改",
            type: type,
            formData: this.multipleSelection[0]
          };
        } else if (type == "binding") {
          //绑定部门
          this.popData = {
            title: "绑定部门",
            type: type,
            formData: {
              name: "啦啦啦啦啦",
              status: 1,
              startDate: "",
              endDate: ""
            }
          };
        } else if (type == "untie") {
          //解绑部门
          this.popData = {
            title: "提示",
            type: type
          };
        } else if (type == "import") {
          //导入数据
          this.popData = {
            title: "导入数据",
            type: type,
            formData: {
              file: "啦啦啦啦啦"
            }
          };
        } else if (type == "setting") {
          //摄像头设置
          this.popData = {
            title: "摄像头设置",
            type: type,
            formData: {
              name: "啦啦啦啦啦",
              status: 1,
              startDate: "",
              endDate: ""
            }
          };
        }
      }
    },
    //删除
    deleteFunc() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请至少选择一条记录",
          type: "warning"
        });
      } else {
        let idArr = [];
        //需要删除的设备id
        this.multipleSelection.forEach(element => {
          idArr.push(element.id);
        });
        //删除接口
        let data = {
          ids: idArr
        };
        xmlRequest({
          url: "/api/hel/device/delete",
          data,
          success: data => {
            //删除成功
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            //刷新列表
            this.getTableList();
          }
        });

        //删除失败
        //this.$message.error('删除失败');
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
