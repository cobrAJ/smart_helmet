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
      <el-button
        type="primary"
        plain
        icon="el-icon-circle-plus-outline"
        @click="openPop('administratorAdd')"
      >新增</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="openPop('administratorChange')">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteFunc">删除</el-button>
    </div>
    <div class="table-wrapper" ref="tableRef">
      <el-table
        :data="tableData"
        border
        :max-height="tableMaxHeight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column type="selection" width="55" label="全选"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="small" type="info" v-if="scope.row.status == 0">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
    <Dialog
      v-if="popVisible"
      :popData="popData"
      :optionData="optionData"
      :defaultPropsData="defaultPropsData"
      @popClose="popClose"
      @getPopData="getPopData"
    />
  </div>
</template>

<script>
import { xmlRequest } from "../utils/utils";
import Dialog from "@/components/Dialog.vue";
export default {
  name: "AdministratorManagement",
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
      tableData: [],
      popVisible: false,
      popData: {},
      optionData: [],
      defaultPropsData: {
        parent: "parentId",
        value: "deptId",
        label: "name",
        children: "children",
      },
    };
  },
  components: {
    Dialog,
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // table max-height不支持百分比，采用获取外层div高度赋值
      this.tableMaxHeight = this.$refs.tableRef.offsetHeight;
    });
    this.getTableList();
    this.getDeptTableList();
  },
  methods: {
    getDeptTableList() {
      xmlRequest({
        url: "/api/sys/dept/list",
        success: (data) => {
          //树形数据组装
          this.$set(this._data, "optionData", data.data);
        },
      });
    },
    //获取表格数据
    getTableList() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data.keyword = this.searchText;
      }
      xmlRequest({
        url: "/api/sys/user/list",
        data,
        success: (data) => {
          this.$set(this.pagesInfo, "total", data.data.total);
          this.$set(this._data, "tableData", data.data.records);
        },
      });
    },
    //表格序号
    indexMethod(index) {
      return index + 1;
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
      let data = val.formData;
      console.log("formData", data);
      if (val.type == "administratorAdd") {
        //新增接口
        xmlRequest({
          url: "/api/sys/user/save",
          data,
          success: (data) => {
            this.$message.success("保存成功");
            //刷新列表
            this.getTableList();
          },
        });
      } else if (val.type == "administratorChange") {
        //修改接口
        xmlRequest({
          url: "/api/sys/user/update",
          data,
          success: (data) => {
            this.$message.success("修改成功");
            //刷新列表
            this.getTableList();
          },
        });
      }
    },
    //打开弹窗
    openPop(type) {
      if (this.multipleSelection.length == 0 && type != "administratorAdd") {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
      } else if (
        this.multipleSelection.length > 1 &&
        type != "administratorAdd"
      ) {
        this.$message({
          message: "只能选择一条记录",
          type: "warning",
        });
      } else {
        this.popVisible = true;
        if (type == "administratorAdd") {
          //新增
          this.popData = {
            title: "新增",
            type: type,
            formData: {
              createTime: "",
              deptId: 0,
              deptName: "",
              email: "",
              mobile: "",
              password: "",
              roleId: 0,
              roleName: "",
              salt: "",
              status: 0,
              // userId: 0,
              username: "",
            },
          };
        } else if (type == "administratorChange") {
          //修改
          this.popData = {
            title: "修改",
            type: type,
            formData: this.multipleSelection[0],
          };
        }
      }
    },
    //删除
    deleteFunc() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请至少选择一条记录",
          type: "warning",
        });
      } else {
        let userIdArr = [];
        //需要删除的用户id
        this.multipleSelection.forEach((element) => {
          userIdArr.push(element.userId);
        });
        //删除接口
        let data = {
          userIds: userIdArr,
        };
        xmlRequest({
          url: "/api/sys/user/delete",
          data,
          success: (data) => {
            //删除成功
            this.$message({
              message: "删除成功！",
              type: "success",
            });
            //刷新列表
            this.getTableList();
          },
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
}
</style>
