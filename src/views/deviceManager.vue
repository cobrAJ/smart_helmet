<template>
  <div class="device-manager">
    <div class="tools-wrapper">
      <el-input placeholder="请输入内容" v-model="searchText" class='search-input'>
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" plain>权限设置</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="tableData" height="250" border style="width: 100%">
        <el-table-column prop="number" label="设备号" ></el-table-column>
        <el-table-column prop="status" label="设备状态" >
            <template slot-scope="scope">
                <el-tag size="small" v-if="scope.row.status == 'charging'">充电中</el-tag>
                <el-tag size="small" type="success" v-if="scope.row.status == 'using'">使用中</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="date" label="使用时间"></el-table-column>
        <el-table-column prop="setting" label="摄像头设置">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain>设置</el-button>
            </template>
        </el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "DeviceManager",
  data() {
    return {
        searchText:'',
      currentPage: 4,
      tableData: [
        {
          date: "2016-05-03",
          number: "11111",
          status: 'using',
          setting:true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: 'using',
          setting:true
        },
        {
          date: "2016-05-03",
          number: "11111",
          status: 'charging',
          setting:true
        }
      ]
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
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
  .tools-wrapper {
    height: 40px;
    display: flex;
    margin-bottom:30px;
    .search-input {
        width:300px;
        margin-right:50px
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
