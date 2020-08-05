<template>
  <div class="device-manager organization">
    <div class="tools-wrapper">
      <el-button
        type="primary"
        plain
        icon="el-icon-circle-plus-outline"
        @click="openPop('organizationAdd')"
      >新增</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="openPop('organizationChange')">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteFunc">删除</el-button>
    </div>
    <div class="table-wrapper" ref="tableRef">
      <el-table
        :data="tableData"
        style="width: 100%;"
        border
        row-key="deptId"
        :max-height="tableMaxHeight"
        @current-change="selectRow"
        highlight-current-row
        :indent="indent"
        :tree-props="{children: 'children'}"
      >
        <el-table-column label width="100">
          <template slot-scope="scope">
            <el-radio
              v-model="currentRadio"
              :label="scope.row.deptId"
              text-color="transparent"
            >{{scope.row.deptId}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="deptId" label="部门ID"></el-table-column>
        <el-table-column prop="name" label="部门名称"></el-table-column>
        <el-table-column prop="parentName" label="上级部门"></el-table-column>
      </el-table>
      <!-- 表格 end-->
    </div>
    <div class="foot-wrapper">
      <!-- 分页 begin-->
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
      <!-- 分页 end-->
    </div>

    <!-- 新增弹窗 begin-->
    <Dialog v-if="popVisible" :popData="popData" @popClose="popClose" @getPopData="getPopData" />
    <!-- 新增弹窗 end-->
  </div>
</template>

<script>
import { xmlRequest } from "../utils/utils";
import Dialog from "@/components/Dialog.vue";
export default {
  name: "OrganizationManagement",
  data() {
    return {
      selectRowData: {}, //选中行
      isSelectRow: false,
      indent: 0,
      currentRadio: -1,
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
  },
  methods: {
    /*//转换成树状结构所需要的data格式
    toTree(objects, keyName, parentKeyName) {
      if (!keyName) {
        throw "keyName argument is required";
      }
      if (!parentKeyName) {
        throw "parentKeyName argument is required";
      }
      // 列表项字典 将数组变成以objectId分组的对象，类似于{Vvwkeujpo:{},Rohdsfdofj:{}}
      var map = {};
      objects.forEach(x => (map[x[keyName]] = Object.assign({}, x)));
      // 已添加到父项的键
      var pushed = {};
      // 遍历列表项，将子项添加到父项的 children 数组
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          // 这样就可以过滤掉原型链上的可枚举属性了
          const x = map[key];
          if (x && x[keyName] && x[parentKeyName]) {
            var parent = map[x[parentKeyName]];
            if (parent) {
              if (!parent.children) {
                parent.children = [];
              }
              parent.children.push(x);
              pushed[x[keyName]] = true;
            }
          }
        }
      }
    排除已添加到父项的项得到树
      var tree = [];
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const x = map[key];
          if (!pushed[x[keyName]]) {
            tree.push(x);
          }
        }
      }
      return tree;
    },*/

    //获取表格数据
    getTableList() {
      let data = { ...this.pagesInfo };
      if (this.searchText) {
        data.keyword = this.searchText;
      }
      xmlRequest({
        url: "/api/sys/dept/list",
        data,
        success: (data) => {
          this.$set(this.pagesInfo, "total", data.data.total);
          //树形数据组装
          this.$set(this._data, "tableData", data.data);
        },
      });
    },
    //当前选中行
    selectRow(val) {
      this.selectRowData = val;
      this.isSelectRow = true;
      this.$set(this._data, "currentRadio", val.deptId);
    },
    //打开弹窗
    openPop(type) {
      if (!this.isSelectRow && type != "organizationAdd") {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
      } else {
        this.popVisible = true;
        if (type == "organizationAdd") {
          //新增
          this.popData = {
            title: "新增",
            type: type,
            formData: {
              parentId: this.selectRowData.deptId,
              parentName: this.selectRowData.name,
            },
          };
        } else if (type == "organizationChange") {
          //修改
          this.popData = {
            title: "修改",
            type: type,
            formData: this.multipleSelection[0],
          };
        }
      }
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
      if (val.type == "organizationAdd") {
        //新增接口
        xmlRequest({
          url: "/api/sys/dept/save",
          data,
          success: (data) => {
            this.$message.success("保存成功");
            //刷新列表
            this.getTableList();
          },
        });
      } else if (val.type == "organizationChange") {
        //修改接口
        xmlRequest({
          url: "/api/sys/dept/update",
          data,
          success: (data) => {
            this.$message.success("修改成功");
            //刷新列表
            this.getTableList();
          },
        });
      }
    },
    //删除
    deleteFunc() {
      if (this.currentRadio == -1) {
        this.$message({
          message: "请至少选择一条记录",
          type: "warning",
        });
      } else {
        //删除接口
        let data = {
          deptId: this.selectRowData.deptId,
        };
        xmlRequest({
          url: "/api/sys/dept/delete",
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
