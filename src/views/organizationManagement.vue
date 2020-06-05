<template>
  <div class="device-manager organization">
    <div class="tools-wrapper">
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="openPop('add')">新增</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="openPop('change')">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteFunc">删除</el-button>
    </div>
    <div class="table-wrapper" ref="tableRef">
      <el-table
        :data="tableData"
        style="width: 100%;"
        row-key="id"
        border
        :max-height="tableMaxHeight"
        highlight-current-row
        @current-change="selectRow"
        :indent="indent"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="id" label width="100">
          <template slot-scope="scope">
            <el-radio v-model="currentRadio" :label="scope.row.id" text-color="transparent"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="部门ID"></el-table-column>
        <el-table-column prop="name" label="部门名称"></el-table-column>
        <el-table-column prop="address" label="上级部门"></el-table-column>
      </el-table>
      <!-- 表格 end-->
    </div>
    <div class="foot-wrapper">
      <!-- 分页 begin-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
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
export default {
  name: "OrganizationManagement",
  data() {
    return {
      indent: 0,
      currentRadio: -1,
      tableMaxHeight: 0,
      multipleSelection: [],
      searchText: "",
      currentPage: 4,
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄",
              children: [
                {
                  id: 311,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                },
                {
                  id: 312,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                }
              ]
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            }
          ]
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
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
    //当前选中行
    selectRow(val) {
      this.currentRadio = val.id;
    },
    //打开弹窗
    openPop(type) {
      if (this.multipleSelection.length == 0 && type != "add") {
        this.$message({
          message: "请选择一条记录",
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
              name: "",
              status: 1
            }
          };
        } else if (type == "change") {
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
      if (this.multipleSelection.length == 0 && type != "add") {
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
        //导出
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
