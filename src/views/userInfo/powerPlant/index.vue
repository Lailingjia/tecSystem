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
  .table{
    padding-bottom: 1px;
  }
</style>
<template>
    <div id="info" class="info">
      <el-row :gutter="45">
       <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" label-position="top">
          <el-col :span="22" :push="1">
              <h4 style="text-align: center;">电厂用户基本信息表</h4>
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
            <h5>一、机组参数</h5>
          </el-col>
         <el-col :span="24">
         <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
             <el-button
               type="primary"
               icon="el-icon-plus"
               size="mini"
               @click="handleAdd"
               v-hasPermi="['system:user:add']"
             >新增</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button
               type="success"
               icon="el-icon-edit"
               size="mini"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:user:edit']"
             >修改</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button
               type="danger"
               icon="el-icon-delete"
               size="mini"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:user:remove']"
             >删除</el-button>
           </el-col>
         </el-row>
         </el-col>
         <el-col :span="24">
         <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" border class="table">
           <el-table-column type="selection" width="50" align="center" />
           <el-table-column label="机组名称" align="center" prop="userId" />
           <el-table-column label="厂家" align="center" prop="userName" :show-overflow-tooltip="true" />
           <el-table-column label="型号" align="center" prop="nickName" :show-overflow-tooltip="true" />
           <el-table-column label="额定功率（kw）" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
           <el-table-column label="额定工况下耗气量（Nm³/h）" align="center" prop="phonenumber" />
           <el-table-column label="最低负荷要求%" align="center" prop="userName" :show-overflow-tooltip="true" />
           <el-table-column label="正常用气压力范围MPa" align="center" prop="nickName" :show-overflow-tooltip="true" />
           <el-table-column label="可承受的最高压力MPa" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
           <el-table-column label="可承受的最低压力MPa" align="center" prop="phonenumber"  />
           <el-table-column
             label="操作"
             align="center"
             width="180"
             class-name="small-padding fixed-width"
           >
             <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="handleUpdate(scope.row)"
               >修改</el-button>
               <el-button
                 v-if="scope.row.userId !== 1"
                 size="mini"
                 type="text"
                 icon="el-icon-delete"
                 @click="handleDelete(scope.row)"
               >删除</el-button>
             </template>
           </el-table-column>
         </el-table>
         </el-col>

         <el-col :span="24">
           <h5>二、天然气管道、设备参数</h5>
         </el-col>
         <el-col :span="24">
           <!--<h5 class="is-required">连接管道</h5>-->
           <label class="el-form-item__label is-required" style="text-align: left">连接管道</label>
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
               <template slot="prepend">设计压力</template>
               <template slot="append">MPa</template>
             </el-input>
           </el-form-item>
         </el-col>
         <el-col :span="24">
           <!--<h5 class="is-required">主要设备参数</h5>-->
           <label class="el-form-item__label is-required" style="text-align: left">主要设备参数</label>
         </el-col>
         <el-col :span="8">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required">过滤器</label>
             </el-col>
             <el-col :span="12">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">设计压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">处理能力</template>
                   <template slot="append">Nm³/h</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="16">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required" >流量计</label>
             </el-col>
             <el-col :span="6">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">设计压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">口径</template>
                   <template slot="append">mm</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">计量上限</template>
                   <template slot="append">m³/h</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">计量下限</template>
                   <template slot="append">m³/h</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="24" style="padding: 10px"></el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required">一级调压阀</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">压力等级</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">调压前压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">调压后压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="12">
           <el-row :gutter="15" class="row-border">
             <el-col :span="24">
               <label class="el-form-item__label is-required">二级调压阀</label>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">压力等级</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">调压前压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="" label-width="0" prop="company">
                 <el-input v-model="formData.field131" placeholder="" clearable :style="{width: '100%'}">
                   <template slot="prepend">调压后压力</template>
                   <template slot="append">MPa</template>
                 </el-input>
               </el-form-item>
             </el-col>
           </el-row>
         </el-col>
         <el-col :span="24">
           <h5>三、其他参数（可另附）</h5>
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

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="机组名称" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入机组名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="厂家" prop="deptId">
                <el-input v-model="form.deptId" placeholder="请输入机组名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="型号" prop="phonenumber">
                <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="额定功率" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">kw</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item  label="额定工况下耗气量" prop="userName">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">Nm³/h</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="最低负荷要求" prop="userName">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item  label="正常用气压力范围" prop="userName">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">MPa</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="可承受的最高压力" prop="userName">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">MPa</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item  label="可承受的最低压力" prop="userName">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" >
                  <template slot="append">MPa</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
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
      userList:[],
      loading:false,
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 是否显示弹出层
      open: false,
      title:'',
      form: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      },
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
      let isRightSize = file.size / 1024 / 1024 < 100;
      if (!isRightSize) {
        this.$message.error('文件大小超过 100MB')
      }
      return isRightSize
    },
    uploadFileBeforeUpload2(file) {
      let isRightSize = file.size / 1024 / 1024 < 100;
      if (!isRightSize) {
        this.$message.error('文件大小超过 100MB')
      }
      return isRightSize
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.reset();
      this.title="添加机组参数";
      this.open=true;
      // getUser().then(response => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = this.initPassword;
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.title="修改机组参数";
      this.open=true;
      const userId = row.userId || this.ids;
      // getUser(userId).then(response => {
      //   this.form = response.data;
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.form.postIds = response.postIds;
      //   this.form.roleIds = response.roleIds;
      //   this.open = true;
      //   this.title = "修改用户";
      //   this.form.password = "";
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
  },
};
</script>
