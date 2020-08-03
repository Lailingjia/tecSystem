<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="88px">
      <!--<el-form-item label="申请公司" prop="companyName">-->
      <!--<el-select v-model="queryParams.companyName" placeholder="请选择申请公司名称" clearable size="small">-->
      <!--<el-option label="请选择字典生成" value="" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="申请人" prop="applicatName">
        <el-input v-model="queryParams.applicatName" placeholder="请输入申请人名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="申请单位" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入申请公司" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="影响区域" prop="infulenceArea">
        <el-input v-model="queryParams.infulenceArea" placeholder="请输入影响区域" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="计划时间">
        <el-date-picker type="datetimerange" v-model="dateRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '70%'}"
          start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" clearable :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="计划开始时间" prop="workBeginTime" label-width="120px">
       <el-date-picker clearable size="small" style="width: 150px" v-model="queryParams.workBeginTime" type="date"
         value-format="yyyy-MM-dd" placeholder="选择计划开始时间">
       </el-date-picker>
     </el-form-item>
     <el-form-item label="计划结束时间" prop="workEndTime" label-width="120px">
       <el-date-picker clearable size="small" style="width: 150px" v-model="queryParams.workEndTime" type="date"
         value-format="yyyy-MM-dd" placeholder="选择计划结束时间">
       </el-date-picker>
     </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['overhaul:overhaulInfo:add']"
          v-hasRole="['process_plan_Sponsor']">新增</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="success"-->
      <!--icon="el-icon-edit"-->
      <!--size="mini"-->
      <!--:disabled="single"-->
      <!--@click="handleUpdate"-->
      <!--v-hasPermi="['overhaul:overhaulInfo:edit']"-->
      <!--&gt;修改</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['overhaul:overhaulInfo:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['overhaul:overhaulInfo:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="overhaulInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="组件自增" align="center" prop="id"  />-->
      <el-table-column label="作业名称" align="center" prop="programName" />
      <el-table-column label="申请公司id" align="center" prop="companyName" />
      <el-table-column label="申请人id" align="center" prop="applicatName" />
      <el-table-column label="影响区域" align="center" prop="infulenceArea" />
      <el-table-column label="计划开始时间" align="center" prop="workBeginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workBeginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="workEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-tickets" @click="handleresource(scope.row)" v-hasPermi="['overhaul:overhaulInfo:query']">详情</el-button>
          <!--<el-button-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--icon="el-icon-edit"-->
          <!--@click="handleUpdate(scope.row)"-->
          <!--v-hasPermi="['overhaul:overhaulInfo:edit']"-->
          <!--&gt;修改</el-button>-->
          <el-button size="mini" type ="text" icon="el-icon-edit" @click="handleApprove(scope.row)"
            v-hasPermi="['overhaul:overhaulInfo:approval']"
            v-hasRole="['process_plan_deptManager','process_plan_dispatchingCenter','process_plan_disCenterManager']"
            v-if="isShow(scope.row.status)">审批</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRevoke(scope.row)"
            v-hasPermi="['overhaul:overhaulInfo:revoke']"
            v-if="revokeIsShow(scope.row)">
            撤销</el-button>
            <!--<el-button
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['overhaul:overhaulInfo:remove']"-->
            <!--&gt;删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改检修详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <!--<baseInfo ref="form" :form="form" :getList="getList"/>-->
      <el-row :gutter="21">
        <el-form ref="baseInfoForm" :model="form" :rules="rules" size="medium" label-width="125px" label-position="top">
          <el-col :span="8">
            <el-form-item label="作业名称：" prop="programName">
              <el-input v-model="form.programName" placeholder="请输入作业名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请单位：" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入申请单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业申请人：" prop="applicatName">
              <el-input v-model="form.applicatName" placeholder="请输入申请人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人联系方式：" prop="tel">
              <el-input v-model="form.tel" placeholder="请输入申请人电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8" v-show="readonly">-->
          <!--<el-form-item  label="申请日期：" prop="createTime" >-->
          <!--<el-date-picker type="date" v-model="form.createTime" format="yyyy-MM-dd"-->
          <!--value-format="yyyy-MM-dd"  placeholder="选择申请时间" style="width:100%"-->
          <!--clearable ></el-date-picker>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="申请事由：" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入申请事由" :rows="2" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业影响范围：" prop="infulenceArea">
              <el-input v-model="form.infulenceArea" placeholder="请输入作业影响范围" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="影响开始时间：" prop="infulenceTime">
              <el-date-picker type="date" v-model="form.infulenceBeginTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                placeholder="影响开始时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="影响结束时间：" prop="infulenceTime">
              <el-date-picker type="date" v-model="form.infulenceEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                placeholder="影响结束时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="16" style="position: relative;">
            <el-form-item label="作业方案：" prop="planInfo">
              <el-input v-model="form.planInfo" type="textarea" placeholder="请输入作业方案" :autosize="{minRows: 5, maxRows: 5}"
                :style="{width: '100%'}"></el-input>
            </el-form-item>
            <el-form-item style="position: absolute;top: 0;right:10px;">
              <el-upload ref="planAnnexAddr" :file-list="planAnnexAddrfileList" :action="planAnnexAddrAction"
                :before-upload="planAnnexAddrBeforeUpload">
                <el-button size="small" type="warning" icon="el-icon-upload">导入作业方案</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划开始时间：" prop="PlanTime">
              <el-date-picker type="date" v-model="form.workBeginTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{width: '100%'}" placeholder="计划开始时间" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划结束时间：" prop="PlanTime">
              <el-date-picker type="date" v-model="form.workEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{width: '100%'}" placeholder="计划结束时间" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" style="width:150px">提 交</el-button>
        <el-button @click="cancel" style="width:150px">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import baseInfo from "../profile/baseInfo";
  import {
    getUserProfile
  } from "@/api/system/user";
  import {
    listOverhaulInfo,
    getOverhaulInfo,
    delOverhaulInfo,
    addOverhaulInfo,
    updateOverhaulInfo
  } from "@/api/overhaul/overhaulInfo";

  export default {
    name: "OverhaulInfo",
    components: {
      baseInfo
    },
    checked: false,
    data() {
      return {
        activeName: 'basemessage',
        tableData: [{
          num: '1',
          flowpro: 'xxxx',
          person: 'xxx',
          result: 'ok',
          suggest: 'xx',
          shtime: 'xxx-xx'
        }],
        resData: [{

        }],
        resData2: [{

        }],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 检修详情表格数据
        overhaulInfoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        open2: false,
        statusOptions: [],
        // 日期范围
        dateRange: [],
        //时间快捷选项
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          companyName: undefined,
          applicatName: undefined,
          infulenceArea: undefined,
          workBeginTime: undefined,
          workEndTime: undefined,
          status: undefined,
        },
        // 表单参数
        form: {},
        user: {},
        planAnnexAddrfileList: [],
        //文件列表   fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},]
        planAnnexAddrAction: '/dev-api/overhaul/common/upload',
        //https://jsonplaceholder.typicode.com/posts/
        // 表单校验
        rules: {
          programName: [{
            required: true,
            message: "作业名称不能为空",
            trigger: "blur"
          }],
          companyName: [{
            required: true,
            message: "申请公司不能为空",
            trigger: "blur"
          }],
          applicatName: [{
            required: true,
            message: "申请人名称不能为空",
            trigger: "blur"
          }],
          tel: [{
            required: true,
            message: "联系电话不能为空",
            trigger: "blur"
          }],
          // Time: [
          //   { required: true, message: "申请时间不能为空", trigger: "blur" }
          // ],
          reason: [{
            required: true,
            message: "申请事由不能为空",
            trigger: "blur"
          }],
          infulenceArea: [{
            required: true,
            message: "影响范围不能为空",
            trigger: "blur"
          }],
          // infulenceTime: [
          //   { required: true, message: "影响时间不能为空", trigger: "blur" }
          // ],
          planInfo: [{
            required: true,
            message: "作业方案不能为空",
            trigger: "blur"
          }],
          // PlanTime: [
          //   { required: true, message: "计划时间不能为空", trigger: "blur" }
          // ],
        },
      };
    },
    created() {
      this.getUser();
      this.getList();
      this.getDicts("overhaul_info_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      revokeIsShow(row){
        console.log(row.createUser+"==>"+this.user.userId)
        console.log(row.status)
        if (row.status == 0&&this.user.userId+''==row.createUser) {
          return true;
        }
        console.log(this.user.userId+''==row.createUser);
        console.log(row.status==0);
        return false;
      },
      isShow(status) {
        if (status == 0 || status == 2) {
          return true;
        }
        return false;
      },
      // 用户信息
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
        });
      },
      /** 查询检修详情列表 */
      getList() {
        this.loading = true;
        listOverhaulInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.overhaulInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 状态(撤销：-1，审批中：0, 驳回：1， 进行中：2，完成：3)字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 取消按钮
      cancel() {
        // this.$refs["form"].cancel();
        this.reset();
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
          workTime: undefined,
          infulenceTime: undefined
        };
        this.resetForm("baseInfoForm");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.form.inside = 0;
        this.form.companyName = this.user.dept.deptName;
        this.form.applicatName = this.user.nickName;
        this.form.tel = this.user.phonenumber;
        this.title = "添加检修计划信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getOverhaulInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改检修详情";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        // this.$refs["form"].submitForm();
        this.$refs["baseInfoForm"].validate(valid => {
          if (valid) {
            if (this.form.workBeginTime != undefined) {
              this.form.workBeginTime = this.form.workBeginTime + " 00:00:00";
            }
            if (this.form.workEndTime != undefined) {
              this.form.workEndTime = this.form.workEndTime + " 00:00:00";
            }
            if (this.form.infulenceBeginTime != undefined) {
              this.form.infulenceBeginTime = this.form.infulenceBeginTime + " 00:00:00";
            }
            if (this.form.infulenceBeginTime != undefined) {
              this.form.infulenceEndTime = this.form.infulenceEndTime + " 00:00:00";
            }
            if (this.form.id != undefined) {
              updateOverhaulInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.getList();
                  this.open = false;
                }
              });
            } else {
              addOverhaulInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.getList();
                  this.open = false;
                }
              });
            }
          }
        });
      },
      /** 撤销按钮操作 */
      handleRevoke(row) {
        const ids = row.id;
        this.$confirm('是否确认撤销作业名称为"' + row.programName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          var data = {id:ids,status:-1,result:0,inside:0};
          return receiveApproval(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("撤销成功");
        }).catch(function() {});
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除检修详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOverhaulInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 详情操作 */
      handleresource(row) {
        this.$router.push({
          path: '/overhaul/detail',
          query: {
            id: row.id
          }
        })
      },
      handleApprove(row) {
        this.$router.push({
          path: '/overhaul/detail',
          query: {
            id: row.id,
            active: 'check'
          }
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('overhaul/overhaulInfo/export', {
          ...this.queryParams
        }, `business_overhaulInfo.xlsx`)
      },
      planAnnexAddrBeforeUpload() {

      }
    }
  };
</script>
<style>
  .el-collapse-item__header {
    /*height: 5vh;*/
    background-color: rgba(212, 211, 211, 0.301);
    border-radius: 5px;
  }
</style>
