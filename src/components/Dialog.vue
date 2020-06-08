<template>
  <el-dialog :title="form.title" :visible.sync="isVisible" :before-close="gobackFunc">
    <el-form :model="form.formData" v-if="form.type == 'add' || form.type == 'change'">
      <el-form-item label="设备号" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="设备号"></el-input>
      </el-form-item>
      <div class="fixed">
        <el-form-item label="经度" label-width="80px">
          <el-input v-model="form.formData.name" autocomplete="off" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" label-width="80px">
          <el-input v-model="form.formData.name" autocomplete="off" placeholder="纬度"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="位置" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="输入经纬度自动显示位置"></el-input>
      </el-form-item>
      <el-form-item label="绑定部门" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="所属部门"></el-input>
      </el-form-item>
      <el-form-item label="IMEI" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="输入IMEI"></el-input>
      </el-form-item>
      <el-form-item label="DEVICEID" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="输入deviceid"></el-input>
      </el-form-item>
      <el-form-item label="PORT" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="输入port"></el-input>
      </el-form-item>
      <el-form-item label="状态" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form :model="form.formData" v-if="form.type == 'setting'">
      <el-form-item label="设备号" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="输入port"></el-input>
      </el-form-item>
      <el-form-item label="权限设置" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.status">
          <el-radio :label="1">永久开启</el-radio>
          <el-radio :label="0">时段开启</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="起始时间" label-width="80px" style="text-align: left;">
        <el-date-picker v-model="form.formData.startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="终止时间" label-width="80px" style="text-align: left;">
        <el-date-picker v-model="form.formData.endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-form :model="form.formData" v-if="form.type == 'binding'">
      <el-form-item label="部门" label-width="80px">
        <select-tree v-model="selected" :options="options" :props="defaultProps" />
      </el-form-item>
    </el-form>
    <span v-if="form.type == 'untie'">确定是否解绑部门？</span>
    <el-form :model="form.formData" v-if="form.type == 'import'">
      <el-form-item label="Excel文件" label-width="80px">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          accept=".xls"
          :file-list="fileList"
          :on-exceed="handleExceed"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传.xls文件</div>
        </el-upload>
        <a href="###" style="color:#2897ff">点击导出下载模板</a>
      </el-form-item>
    </el-form>
    <el-form
      :model="form.formData"
      v-if="form.type == 'organizationAdd' || form.type == 'organizationChange'"
    >
      <el-form-item label="部门名称" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" label-width="80px">
        <select-tree v-model="selected" :options="options" :props="defaultProps" />
        <p
          style="font-size:12px;color:red;line-height: 12px;text-align: left;"
        >*部门降级后权限会随之降级，无法恢复，请谨慎操作。</p>
      </el-form-item>
      <el-form-item label="登陆密码" label-width="80px">
        <el-input type="password" v-model="form.formData.password" placeholder="登陆密码"></el-input>
      </el-form-item>
    </el-form>
    <el-form
      :model="form.formData"
      v-if="form.type == 'administratorAdd' || form.type == 'administratorChange'"
    >
      <el-form-item label="上级部门" label-width="80px">
        <select-tree v-model="selected" :options="options" :props="defaultProps" />
      </el-form-item>
      <el-form-item label="用户名" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px">
        <el-input type="password" v-model="form.formData.password" placeholder="登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="form.formData.name" autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="状态" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form
      :model="form.formData"
      v-if="form.type == 'changePassword'"
    >
    <el-form-item label="用户名" label-width="80px">
        <el-input v-model="form.formData.name" disabled autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="原密码" label-width="80px">
        <el-input type="password" v-model="form.formData.oldPassword" placeholder="登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" label-width="80px">
        <el-input type="password" v-model="form.formData.password" placeholder="登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" label-width="80px">
        <el-input type="password" v-model="form.formData.confirmPassword" placeholder="登陆密码"></el-input>
      </el-form-item>
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="gobackFunc">返回</el-button>
      <el-button type="primary" @click="confirmFunc">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from "./SelectTree.vue";
export default {
  name: "Dialog",
  props: {
    popData: {
      type: Object
    }
  },
  data() {
    return {
      fileList: [],
      isVisible: true,
      form: this.popData,
      // 默认选中值
      selected: "A",
      // 数据默认字段
      defaultProps: {
        parent: "parentId", // 父级唯一标识
        value: "id", // 唯一标识
        label: "label", // 标签显示
        children: "children" // 子级
      },
      // 数据列表
      options: [
        {
          parentId: "0",
          id: "A",
          label: "label-A",
          children: [
            {
              parentId: "A",
              id: "A-1",
              label: "label-A-1"
            }
          ]
        },
        {
          parentId: "0",
          value: "B",
          label: "label-B",
          children: []
        }
      ]
    };
  },
  components: {
    SelectTree
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(111, file, fileList);
    },
    handlePreview(file) {
      console.log(222, file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //返回
    gobackFunc() {
      this.$emit("popClose", true);
    },
    //确定
    confirmFunc() {
      this.$emit("getPopData", this.form);
    }
  }
};
</script>
<style lang="less">
</style>
