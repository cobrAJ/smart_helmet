<template>
  <div class="device-manager">
    <div class="tools-wrapper">
      <el-input placeholder="请输入相关信息进行查询" v-model="searchText" class="search-input">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="openPop('administratorAdd')">新增</el-button>
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
        <el-table-column prop="number" label="用户名"></el-table-column>
        <el-table-column prop="number" label="所属部门"></el-table-column>
        <el-table-column prop="number" label="邮箱"></el-table-column>
        <el-table-column prop="number" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 'charging'">正常</el-tag>
            <el-tag size="small" type="info" v-if="scope.row.status == 'using'">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="创建时间"></el-table-column>
      </el-table>
    </div>
    <div class="foot-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>
    <!-- 新增弹窗 -->
    <Dialog v-if="popVisible" :popData="popData" @popClose="popClose" @getPopData="getPopData" />
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
export default {
  name: "AdministratorManagement",
  data() {
    return {
      tableMaxHeight: 0,
      multipleSelection: [],
      searchText: "",
      currentPage: 4,
      tableData: [
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "charging",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "charging",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "charging",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "charging",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "using",
          setting: true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: "charging",
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
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
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
    //打开弹窗
    openPop(type) {
      if (this.multipleSelection.length == 0 && type != "administratorAdd") {
        this.$message({
          message: "请选择一条记录",
          type: "warning"
        });
      } else if (this.multipleSelection.length > 1 && type != "administratorAdd") {
        this.$message({
          message: "只能选择一条记录",
          type: "warning"
        });
      } else {
        this.popVisible = true;
        if (type == "administratorAdd") {
          //新增
          this.popData = {
            title: "新增",
            type: type,
            formData: {
              name: "",
              status: 1
            }
          };
        } else if (type == "administratorChange") {
          //修改
          this.popData = {
            title: "修改",
            type: type,
            formData: {
              name: "啦啦啦啦啦",
              status: 0
            }
          };
        }
      }
    },
    //删除
    deleteFunc() {
      if (this.multipleSelection.length) {
        this.$message({
          message: "请选择一条记录",
          type: "warning"
        });
      } else {
        //删除成功
        this.$message({
          message: "删除成功！",
          type: "success"
        });
        //删除失败
        //this.$message.error('删除失败');
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
