<template>
  <el-dialog :title="form.title" :visible="isVisible" :before-close="closeDialog">
    <el-form :model="form.formData" v-if="form.type == 'add' || form.type == 'change'">
      <el-form-item label="设备号" label-width="80px">
        <el-input v-model="form.formData.deviceNo" autocomplete="off" placeholder="设备号"></el-input>
      </el-form-item>
      <div class="fixed">
        <el-form-item label="经度" label-width="80px">
          <el-input v-model="form.formData.lng" autocomplete="off" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" label-width="80px">
          <el-input v-model="form.formData.lat" autocomplete="off" placeholder="纬度"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="创建时间" label-width="80px" style="text-align: left;">
        <el-date-picker v-model="form.formData.startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="位置" label-width="80px">
        <el-input v-model="form.formData.address" autocomplete="off" placeholder="输入经纬度自动显示位置"></el-input>
      </el-form-item>
      <el-form-item label="绑定部门" label-width="80px">
        <el-input v-model="form.formData.deptId" autocomplete="off" placeholder="绑定部门"></el-input>
      </el-form-item>
      <el-form-item label="4G卡号" label-width="80px">
        <el-input v-model="form.formData.fourGNo" autocomplete="off" placeholder="4G卡号"></el-input>
      </el-form-item>
      <el-form-item label="使用人ID" label-width="80px">
        <el-input v-model="form.formData.userId" autocomplete="off" placeholder="使用人ID"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="设备类型" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.deviceType">
          <el-radio :label="1">永久开启</el-radio>
          <el-radio :label="0">时段开启</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="开始时间"
        v-if="form.formData.deviceType == 1"
        label-width="80px"
        style="text-align: left;"
      >
        <el-date-picker
          v-model="form.formData.deviceStartTime"
          type="datetime"
          placeholder="选择开始时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="结束时间"
        v-if="form.formData.deviceType == 1"
        label-width="80px"
        style="text-align: left;"
      >
        <el-date-picker v-model="form.formData.deviceEndTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
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
        <input
          type="file"
          @change="importf(this)"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
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
        <el-input v-model="form.formData.parentName" autocomplete="off" placeholder="上级部门"></el-input>
        <!-- <select-tree v-model="selected" :options="options" :props="defaultProps" /> -->
        <p
          style="font-size:12px;color:red;line-height: 12px;text-align: left;margin-top:5px"
        >*部门降级后权限会随之降级，无法恢复，请谨慎操作。</p>
      </el-form-item>
      <!-- <el-form-item label="登陆密码" label-width="80px">
        <el-input type="password" v-model="form.formData.password" placeholder="登陆密码"></el-input>
      </el-form-item>-->
    </el-form>
    <el-form
      :model="form.formData"
      v-if="form.type == 'administratorAdd' || form.type == 'administratorChange'"
    >
      <!-- <el-form-item label="上级部门" label-width="80px">
        <select-tree v-model="selected" :options="options" :props="defaultProps" />
      </el-form-item>-->
      <el-form-item label="用户名" label-width="80px">
        <el-input v-model="form.formData.username" autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px">
        <el-input type="password" v-model="form.formData.password" placeholder="登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px">
        <el-input v-model="form.formData.mobile" autocomplete="off" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="form.formData.email" autocomplete="off" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="状态" label-width="80px" style="text-align: left;">
        <el-radio-group v-model="form.formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form :model="form.formData" v-if="form.type == 'changePassword'">
      <!-- <el-form-item label="用户名" label-width="80px">
        <el-input v-model="form.formData.name" disabled autocomplete="off" placeholder="部门名称"></el-input>
      </el-form-item>-->
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
      <el-button @click="closeDialog">返回</el-button>
      <el-button type="primary" @click="confirmFunc">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from "./SelectTree.vue";
import { xmlRequest, sstCtrl, cookieCtrl } from "../utils/utils";
export default {
  name: "Dialog",
  props: {
    popData: {
      type: Object
    }
  },
  data() {
    return {
      importExcelList: [],
      fileList: [],
      isVisible: true,
      hasError: false,
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
    //导入excel
    importf(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader(); //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          } // outdata就是你想要的东西 excel导入的数据
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // excel 数据再处理
          let arr = [];
          outdata.map(v => {
            let obj = {};
            obj.address = v["定位地址"];
            obj.createTime = v["创建时间"];
            obj.deptId = v["部门ID"];
            obj.deviceEndTime = v["结束时间"];
            obj.deviceNo = v["设备编号"];
            obj.deviceStartTime = v["开始时间"];
            obj.deviceType = v["设备类型"];
            obj.fourGNo = v["4G卡号"];
            obj.id = v["id"];
            obj.lat = v["纬度"];
            obj.lng = v["经度"];
            obj.status = v["设备状态"];
            obj.userId = v["使用人ID"];
            arr.push(obj);
          });
          _this.importExcelList = [...arr];
          // console.log(1111, _this.importExcelList);
          //更新页面数据
          //_this.reload();
        };

        reader.readAsArrayBuffer(f);
      };

      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    //修改登陆密码
    changePassword() {
      this.hasError = true;
      if (
        this.form.formData.oldPassword ==
          sstCtrl.getItem(location.host).password ||
        this.form.formData.oldPassword ==
          cookieCtrl.getCookie(location.host).password
      ) {
        if (this.form.formData.confirmPassword == this.form.formData.password) {
          this.hasError = false;
          let data = {
            newPassword: this.form.formData.confirmPassword,
            password: this.form.formData.oldPassword
          };
          xmlRequest({
            url: "/api/sys/user/password",
            data,
            success: data => {
              this.$message({
                type: "success",
                message: "密码重置成功,请重新登陆"
              });
              this.closeDialog();
              setTimeout(() => {
                this.$router.push("/login");
              }, 3000);
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "新密码两次输入不一致"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "旧密码不正确"
        });
      }
    },
    closeDialog() {
      if (!this.hasError) {
        this.gobackFunc();
      }
    },
    //返回
    gobackFunc() {
      this.$emit("popClose", true);
    },
    //确定
    confirmFunc() {
      if (this.form.type == "changePassword") {
        this.changePassword();
      } else {
        if (this.importExcelList.length > 0) {
          //导入excel数据
          this.$emit("getPopData", this.importExcelList);
        } else {
          this.$emit("getPopData", this.form);
        }
      }
    }
  }
};
</script>
<style lang="less">
</style>
