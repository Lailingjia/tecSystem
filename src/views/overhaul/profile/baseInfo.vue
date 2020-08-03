<template>
    <el-row :gutter="21">
      <el-form ref="baseInfoForm" :model="form" :rules="rules" size="medium" label-width="125px"
               label-position="top">
        <el-col :span="8">
          <el-form-item  label="作业名称：" prop="programName">
            <el-input v-model="form.programName" placeholder="请输入作业名称" clearable :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="申请单位：" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入申请单位" clearable :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="作业申请人：" prop="applicatName">
            <el-input v-model="form.applicatName" placeholder="请输入申请人" clearable :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="申请人联系方式：" prop="tel" >
            <el-input v-model="form.tel" placeholder="请输入申请人电话" clearable :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="readonly">
          <el-form-item  label="申请日期：" prop="createTime" >
            <el-date-picker type="date" v-model="form.createTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"  placeholder="选择申请时间" style="width:100%"
                            clearable :readonly="readonly"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="申请事由：" prop="reason" >
            <el-input v-model="form.reason"  placeholder="请输入申请事由"
                      :rows="2" clearable :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="作业影响范围：" prop="infulenceArea" >
            <el-input v-model="form.infulenceArea" placeholder="请输入作业影响范围" clearable :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item  label="影响开始时间：" prop="infulenceTime" >
            <el-date-picker type="date" v-model="form.infulenceBeginTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"  placeholder="影响开始时间" style="width:100%"
                            clearable :readonly="readonly"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="影响结束时间：" prop="infulenceTime" >
            <el-date-picker type="date" v-model="form.infulenceEndTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"  placeholder="影响结束时间" style="width:100%"
                            clearable :readonly="readonly"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="position: relative;">
          <el-form-item  label="作业方案：" prop="planInfo" >
            <el-input v-model="form.planInfo" type="textarea" placeholder="请输入作业方案"
                      :autosize="{minRows: 5, maxRows: 5}" :style="{width: '100%'}" :readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item style="position: absolute;top: 0;right:10px;" v-show="!readonly">
            <el-upload ref="planAnnexAddr" :file-list="planAnnexAddrfileList" :action="planAnnexAddrAction"
                       :before-upload="planAnnexAddrBeforeUpload">
              <el-button size="small" type="warning" icon="el-icon-upload" >导入作业方案</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="计划开始时间：" prop="PlanTime" >
            <el-date-picker type="date" v-model="form.workBeginTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划开始时间"
                            clearable :readonly="readonly"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="计划结束时间：" prop="PlanTime" >
            <el-date-picker type="date" v-model="form.workEndTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划结束时间"
                            clearable :readonly="readonly"></el-date-picker>
          </el-form-item>
        </el-col>
        
      </el-form>
    </el-row>
</template>

<script>
  import { addOverhaulInfo,upload } from "@/api/overhaul/overhaulInfo";
export default {
  name:'baseInfo',
  props:{
    form:{
      type:Object
    },
    readonly:{
      default:false,
      type:Boolean
    },
    getList:{
      type: Function,
      default: null
    },
  },
  data() {
    return {
      planAnnexAddrfileList:[],
      //文件列表   fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},]
      planAnnexAddrAction:'/common/upload',
      //https://jsonplaceholder.typicode.com/posts/
      // 表单校验
      rules: {
        programName: [
          { required: true, message: "作业名称不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "申请公司不能为空", trigger: "blur" }
        ],
        applicatName: [
          { required: true, message: "申请人名称不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        // Time: [
        //   { required: true, message: "申请时间不能为空", trigger: "blur" }
        // ],
        reason: [
          { required: true, message: "申请事由不能为空", trigger: "blur" }
        ],
        infulenceArea: [
          { required: true, message: "影响范围不能为空", trigger: "blur" }
        ],
        // infulenceTime: [
        //   { required: true, message: "影响时间不能为空", trigger: "blur" }
        // ],
        planInfo: [
          { required: true, message: "作业方案不能为空", trigger: "blur" }
        ],
        // PlanTime: [
        //   { required: true, message: "计划时间不能为空", trigger: "blur" }
        // ],
      },
    };
  },
  mounted(){
  },
  methods: {
    submitForm(){
      this.$refs["baseInfoForm"].validate(valid => {
        if (valid) {
          if(this.form.workBeginTime!=undefined){
            this.form.workBeginTime=this.form.workBeginTime+" 00:00:00";
          }
          if(this.form.workEndTime!=undefined){
            this.form.workEndTime=this.form.workEndTime+" 00:00:00";
          }
          if(this.form.infulenceBeginTime!=undefined){
            this.form.infulenceBeginTime=this.form.infulenceBeginTime+" 00:00:00";
          }
          if(this.form.infulenceBeginTime!=undefined){
            this.form.infulenceEndTime=this.form.infulenceEndTime+" 00:00:00";
          }
          if (this.form.id != undefined) {
            updateOverhaulInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.getList();
                this.$parent.$parent.open=false;
              }
            });
          } else {
            addOverhaulInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.getList();
                this.$parent.$parent.open=false;
              }
            });
          }
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        programName: undefined,
        companyName: undefined,
        applicatName: undefined,
        tel: undefined,
        reason: undefined,
        infulenceArea: undefined,
        infulenceBeginTime: undefined,
        infulenceEndTime: undefined,
        workBeginTime: undefined,
        workEndTime: undefined,
        planInfo: undefined,
        planAnnexName: undefined,
        planAnnexAddr: undefined,
        status: undefined,
        createTime: undefined,
        updateTime: undefined,
        workTime:undefined,
        infulenceTime:undefined
      };
      this.resetForm("form");
    },
    cancel(){
      this.reset();
    },
    planAnnexAddrBeforeUpload(){

    }
  }
};
</script>
