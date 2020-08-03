<style type="text/css" scoped>
  .row-border{
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }
  .info{
    padding: 0 45px;
  }
  .info label.el-form-item__label{
    padding: 0;
  }
  label.is-required:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  label.is-required{
    width: 100%;
    text-align: center
  }
</style>
<template>
    <div id="info" class="info">
      <el-row :gutter="45">
       <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" label-position="top">
          <el-col :span="22" :push="1">
              <h4 style="text-align: center;">城市用户基本信息表</h4>
          </el-col>
         <el-col :span="1">
           <el-upload ref="uploadFile" :file-list="uploadFile1" :action="uploadFileAction1" accept=".xls,.xlsx"
                      :before-upload="uploadFileBeforeUpload1" :style="{backgroundColor:'orange',marginTop:'45px'}">
             <el-button size="small" type="warning">导入Excel</el-button>
             <!--<div slot="tip" class="el-upload__tip">只能上传不超过 100MB 的文件</div>-->
           </el-upload>
         </el-col>
          <el-col :span="8">
            <el-form-item label="公司名称" prop="company" required>
              <el-input v-model="formData.company" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产运行部门负责人（联系电话）" label-width="255px" prop="field129" required>
              <el-input v-model="formData.field129" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="气量指定部门负责人(联系电话)" label-width="255px" prop="field107" required>
              <el-input v-model="formData.field107" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址"  label-width="100px" prop="company" required>
              <el-input v-model="formData.company" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="24小时值班电话" label-width="255px" prop="field129" required>
              <el-input v-model="formData.field129" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传真" label-width="255px" prop="field107" required>
              <el-input v-model="formData.field107" placeholder="" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <h5>一、设备资料</h5>
          </el-col>
         <el-col :span="8">
           <el-form-item label="设备设计压力"  prop="company" required>
             <el-input v-model="formData.company" placeholder="" show-word-limit clearable
                       :style="{width: '100%'}">
               <template slot="append">MPa</template>
             </el-input>
           </el-form-item>
         </el-col>
         <el-col :span="8">
           <el-form-item label="管道设计压力（与省级分输站连接管道）"  prop="field129" required>
             <el-input v-model="formData.field129" placeholder="" show-word-limit clearable
                       :style="{width: '100%'}">
               <template slot="append">MPa</template>
             </el-input>
           </el-form-item>
         </el-col>
         <el-col :span="8">
           <el-form-item label="最低压力需求"  prop="field107" required>
             <el-input v-model="formData.field107" placeholder="" show-word-limit clearable
                       :style="{width: '100%'}">
               <template slot="append">MPa</template>
             </el-input>
           </el-form-item>
         </el-col>

         <el-col :span="24">
           <h5>二、管道基本参数</h5>
         </el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required">中压管道</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">长度</template>
                   <template slot="append">km</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">管径</template>
                   <template slot="append">mm</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">管容</template>
                   <template slot="append">m3</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <label class="el-form-item__label is-required" >设计压力</label>
             </el-col>
             <el-col :span="16">
               <label class="el-form-item__label is-required" >日常运行压力</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable
                           :style="{width: '100%'}">
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable
                           :style="{width: '100%'}">
                   <template slot="prepend">最高</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable
                           :style="{width: '100%'}">
                   <template slot="prepend">最低</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >高压管道</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">长度</template>
                   <template slot="append">km</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">管径</template>
                   <template slot="append">mm</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">管容</template>
                   <template slot="append">m3</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <label class="el-form-item__label is-required" >设计压力</label>
             </el-col>
             <el-col :span="16">
               <label class="el-form-item__label is-required" >日常运行压力</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">最高</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable
                           :style="{width: '100%'}">
                   <template slot="prepend">最低</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>

         <el-col :span="24">
           <h5>三、用气规模和结构</h5>
         </el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >用气规模</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">初期</template>
                   <template slot="append">万方/天</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">中期</template>
                   <template slot="append">万方/天</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">远期</template>
                   <template slot="append">万方/天</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >用户结构</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">居民</template>
                   <template slot="append">%</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">商业</template>
                   <template slot="append">%</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">工业</template>
                   <template slot="append">%</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>

         <el-col :span="24">
           <h5>四、调峰能力</h5>
         </el-col>
         <el-col :span="4">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >中、高压管道调峰能力（万方）</label>
             </el-col>
             <el-col :span="24">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">初期</template>
                   <template slot="append">万方/天</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="20">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >其它调峰设施</label>
             </el-col>
             <el-col :span="4">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">名 称</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="4">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend"> 水容积</template>
                   <template slot="append">m³</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="5">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">调峰能力</template>
                   <template slot="append">万方</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="5">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">最高压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="5">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">最低压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>

         <el-col :span="24">
           <h5>五、应急状态下运行参数</h5>
         </el-col>
         <el-col :span="8">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >中、高压管道最低运行压力</label>
             </el-col>
             <el-col :span="12">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">中压</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">高压</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="8">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >不可中断用户最低日用气量</label>
             </el-col>
             <el-col :span="12">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">夏季</template>
                   <template slot="append">Nm3/d</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">冬季</template>
                   <template slot="append">Nm3/d</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="8">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >供气中断能维持低负荷运行时间</label>
             </el-col>
             <el-col :span="12">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">高峰</template>
                   <template slot="append">h</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">正常</template>
                   <template slot="append">h</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>

         <el-col :span="24">
           <h5>六、其他参数（可另附）</h5>
         </el-col>
         <el-col :span="12">
           <el-form-item label="附件" prop="uploadFile" required>
           <el-upload ref="uploadFile" :file-list="uploadFile2" :action="uploadFileAction2" multiple
                      :before-upload="uploadFileBeforeUpload2">
             <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
             <div slot="tip" class="el-upload__tip">只能上传不超过 100MB 的文件</div>
           </el-upload>
         </el-form-item>
         </el-col>
         <el-col :span="4" :push="8">
           <el-form-item label="填表日期" label-width="0" prop="company" required>
             <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}"></el-input>
           </el-form-item>
         </el-col>
          <el-col :span="24">
            <el-form-item size="large" align="right">
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    // user: {
    //   type: Object
    // }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      formData:{},
      uploadFileAction1:'/',
      uploadFile1:[],
      uploadFileAction2:'/',
      uploadFile2:[],
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    uploadFileBeforeUpload1(file) {
      let isRightSize = file.size / 1024 / 1024 < 100
      if (!isRightSize) {
        this.$message.error('文件大小超过 100MB')
      }
      return isRightSize
    },
    uploadFileBeforeUpload2(file) {
      let isRightSize = file.size / 1024 / 1024 < 100
      if (!isRightSize) {
        this.$message.error('文件大小超过 100MB')
      }
      return isRightSize
    },
  }
};
</script>
