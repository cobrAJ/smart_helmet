<template>
  <el-dialog :title="form.title" :visible.sync="popVisible">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="gobackFunc">返回</el-button>
      <el-button type="primary" @click="confirmFunc">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    popData: {
      type: Object
    }
  },
  data() {
    return {
      popVisible: true,
      form: this.popData
    };
  },

  methods: {
    //返回
    gobackFunc() {
      this.popVisible = false;
      this.$emit("popClose", true);
    },
    //确定
    confirmFunc() {
      this.$emit("getPopData", this.form);
      this.popVisible = false;
    }
  }
};
</script>
<style lang="less">
</style>
