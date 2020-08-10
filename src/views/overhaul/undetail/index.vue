<style type="text/css">
  #overhaulDetail .text {
    padding-top: 2vh;
    height: 5vh;
  }

  #overhaulDetail .title {
    font-size: 18px;
    flex: 1;
    padding-left: 2vw;
    color: #303133;
    text-align: left;
    margin: 0;
  }

  #overhaulDetail .title-lg {
    font-size: 18px;
    font-weight: bold;
  }

  #overhaulDetail .flex {
    display: flex;
  }

  #overhaulDetail .bt {
    margin-right: 2vw;
  }

  #overhaulDetail .el-collapse-item__header {
    background-color: rgba(212, 211, 211, 0.301);
    border-radius: 5px;
  }

  #overhaulDetail .el-collapse-item__arrow {
    display: none;
  }

  #overhaulDetail .el-table {
    padding-bottom: 1px;
  }
</style>
<template>
  <div class="app-container" id="overhaulDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basemessage">
        <baseInfo :form="form" :readonly="readonly" />
      </el-tab-pane>


      <el-tab-pane label="审批" name="check">
        <el-collapse v-model="activeNames">
          <!-- <el-collapse-item name="1">
            <template slot="title" class="flex">
              <div class="title"><b>发起部门负责人审核</b></div>
              <div class="bt" v-if="step===0 && checkRole(['process_plan_deptManager'])">
                <el-button type="primary" icon="el-icon-check" size="mini" @click.stop="receiveApproval(1)">提交
                </el-button>
                <el-button type="danger" icon="el-icon-close" size="mini" @click.stop="receiveApproval(0)">驳回
                </el-button>
              </div>
            </template>

            <el-row>
              <el-col :span="7" :push="1">
                <p class="text"><b>部门审核人：{{processInfos[0].nickName}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>联系电话：{{processInfos[0].phoneNumber}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>审核时间：{{processInfos[0].createTime?processInfos[0].createTime:"____年____月____日____时____分____"}}</b>
                </p>
              </el-col>
              <el-col :span="15" :push="1">
                <p class="text"><b>确认基本信息、操作流程无误。</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text">
                  <b>备注：</b>
                    <el-input v-if="step===0" type="text" v-model="processInfos[0].opinions"></el-input>
                    <span v-else>{{processInfos[0].opinions}}</span>
                </p>
              </el-col>
            </el-row>
          </el-collapse-item> -->
          <el-collapse-item name="2">
            <template slot="title" class="flex">
              <div class="title"><b>综合调度审核</b></div>
              <div class="bt" v-if="step===0&& checkRole(['process_plan_dispatchingCenter'])">
                <el-button type="primary" icon="el-icon-check" size="mini" @click.stop="receiveApproval(1)">提交
                </el-button>
                <el-button type="danger" icon="el-icon-close" size="mini" @click.stop="receiveApproval(0)">驳回
                </el-button>
              </div>
            </template>
            <el-row>
              <el-col :span="7" :push="1">
                <p class="text"><b>部门审核人：{{processInfos[1].nickName}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>联系电话：{{processInfos[1].phoneNumber}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>审核时间：{{processInfos[1].createTime?processInfos[1].createTime:"____年____月____日____时____分____"}}</b>
                </p>
              </el-col>
              <el-col :span="23" :push="1" v-if="step===0&& checkRole(['process_plan_dispatchingCenter'])">
                <p class="text">
                  <b>许可时间：
                    <el-date-picker type="datetimerange" v-model="dateRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                      :style="{width: '30%'}" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至"
                      clearable></el-date-picker>
                  </b>
                </p>
              </el-col>
              <el-col :span="4" :push="1" v-if="step!==0 || !checkRole(['process_plan_dispatchingCenter'])">
                <p class="text">
                  <b>许可开始时间：
                    <!--<el-date-picker  v-if="step===1&& hasRole('process_plan_dispatchingCenter')" type="date" v-model="processInfos[1].permissionStart" format="yyyy-MM-dd"-->
                    <!--value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="许可开始时间"-->
                    <!--clearable></el-date-picker>-->
                    <span>{{parseTime(processInfos[1].permissionStart , '{y}-{m}-{d}') }}</span>
                  </b>
                </p>
              </el-col>
              <el-col :span="4" :offset="11" v-if="step!==0 || !checkRole(['process_plan_dispatchingCenter'])">
                <p class="text">
                  <b>许可结束时间：
                    <!--<el-date-picker  v-if="step===1&& hasRole('process_plan_dispatchingCenter')" type="date" v-model="processInfos[1].permissionEnd" format="yyyy-MM-dd"-->
                    <!--value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="许可结束时间"-->
                    <!--clearable></el-date-picker>-->
                    <span>{{parseTime(processInfos[1].permissionEnd , '{y}-{m}-{d}') }}</span>
                  </b>
                </p>
              </el-col>
              <el-col :span="15" :push="1">
                <p class="text"><b>确认基本信息、操作流程无误、经审核同意检修计划。</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text">
                  <b>备注：
                    <el-input v-if="step===0&& checkRole(['process_plan_dispatchingCenter'])" type="text" v-model="processInfos[1].opinions"></el-input>
                    <span v-else>{{processInfos[1].opinions}}</span>
                  </b>
                </p>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title" class="flex">
              <div class="title"><b>调度运行中心部门负责人审核</b></div>
              <div class="bt" v-if="step===2 && checkRole(['process_plan_disCenterManager'])">
                <el-button type="primary" icon="el-icon-check" size="mini" @click.stop="receiveApproval(1)">提交
                </el-button>
                <el-button type="danger" icon="el-icon-close" size="mini" @click.stop="receiveApproval(0)">驳回
                </el-button>
              </div>
            </template>

            <el-row>
              <el-col :span="7" :push="1">
                <p class="text"><b>部门审核人：{{processInfos[2].nickName}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>联系电话：{{processInfos[2].phoneNumber}}</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text"><b>审核时间：{{processInfos[2].createTime?processInfos[2].createTime:"____年____月____日____时____分____"}}</b>
                </p>
              </el-col>
              <el-col :span="15" :push="1">
                <p class="text"><b>确认基本信息、操作流程无误、经审核同意检修计划。</b></p>
              </el-col>
              <el-col :span="8">
                <p class="text">
                  <b>备注：
                    <el-input v-if="step===2 && checkRole(['process_plan_disCenterManager'])" type="text" v-model="processInfos[2].opinions"></el-input>
                    <span v-else>{{processInfos[2].opinions}}</span>
                  </b>
                </p>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>


      <el-tab-pane label="反馈" name="response" v-if="step>2">
        <el-row :gutter="12">
          <el-col :span="24">
            <el-card shadow="always" class="flex">
              <b class="title-lg">预期作业方案是否全部完成</b>
              <!--:disabled="(step===3&&checkRole(['process_plan_disCenterManager']))"-->
              <el-radio v-model="feedbackComplete" label="1" border style="margin-left: 1vw;" :disabled="newStatus!=null&&feedbackComplete==0">是</el-radio>
              <el-radio v-model="feedbackComplete" label="0" border :disabled="newStatus!=null&&feedbackComplete==1">否</el-radio>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top:2vh;margin-bottom:1vh;">
            <el-card shadow="always">
              <b class="title-lg">具体完成作业内容</b>
              <div style="float:right;" v-if="step===3 && checkRole(['process_plan_disCenterManager'])">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="feedbackAdd(1)">添加</el-button>
              </div>

            </el-card>
          </el-col>
          <div class="restab1">
            <el-table v-loading="loading" :data="feedbackTable[0]" border style="width: 98%;margin-left:1%">
              <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
              <el-table-column label="作业内容" align="center" prop="content" />
              <el-table-column label="执行情况" align="center" prop="complete" :formatter="statusFormat" width="250" />
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250" v-if="step===3&&checkRole(['process_plan_disCenterManager'])">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="feedbackUpdate(1,scope.row)">修改
                  </el-button>
                  <el-button size="mini" type="text" @click="feedbackRemove(1,scope.row,scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 具体完成作业内容添加或修改检修详情对话框 -->
          <el-dialog :title="feedbackFormTitle[0]" :visible.sync="feedbackFormOpen1" width="500px" append-to-body>
            <el-row :gutter="21">
              <el-form ref="feedbackForm1" :model="feedbackForm[0]" :rules="feedbackRules0" size="medium" label-width="125px"
                label-position="top">
                <el-col :span="24">
                  <el-form-item label="作业内容：" prop="content">
                    <el-input v-model="feedbackForm[0].content" placeholder="请输入作业内容" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="执行情况：" prop="complete">
                    <el-select v-model="feedbackForm[0].complete" placeholder="请选择执行情况" style="width: 100%">
                      <el-option label="完成" :value="1"></el-option>
                      <el-option label="未完成" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer" v-loading="loading">
              <el-button type="primary" @click="feedbackSave(1)">提 交</el-button>
              <el-button @click="cancel">重 置</el-button>
            </div>
          </el-dialog>

          <el-col :span="24" style="margin-top:2vh;margin-bottom:1vh;">
            <el-card shadow="always">
              <b class="title-lg">遗留问题</b>
              <div style="float:right;" v-if="step===3&&checkRole(['process_plan_disCenterManager'])">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="feedbackAdd(2)">添加</el-button>
              </div>
            </el-card>
          </el-col>
          <div class="restab2">
            <el-table v-loading="loading" :data="feedbackTable[1]" border style="width: 98%;margin-left:1%">
              <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
              <el-table-column label="遗留内容" align="center" prop="content" />
              <el-table-column label="解决时间" align="center" prop="solveTime" width="250">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.solveTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250" v-if="step===3&&checkRole(['process_plan_disCenterManager'])">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="feedbackUpdate(2,scope.row)">修改
                  </el-button>
                  <el-button size="mini" type="text" @click="feedbackRemove(2,scope.row,scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--<div style="float:right;">-->
            <!--<el-button type="primary" icon="el-icon-plus" size="mini" @click="feedbackAdd(1)">添加</el-button>-->
            <!--</div>-->
            <el-col :span="24" style="margin-top:2vh;margin-bottom:1vh;margin-left: 44%">
              <el-button v-if="step===3&&checkRole(['process_plan_disCenterManager'])" type="success" icon="el-icon-check"
                size="medium" @click="receiveApproval(1)">提交反馈
              </el-button>
            </el-col>
          </div>
          <!-- 遗留问题添加或修改检修详情对话框 -->
          <el-dialog :title="feedbackFormTitle[1]" :visible.sync="feedbackFormOpen2" width="500px" append-to-body>
            <el-row :gutter="21">
              <el-form ref="feedbackForm2" :model="feedbackForm[1]" :rules="feedbackRules1" size="medium" label-width="125px"
                label-position="top">
                <el-col :span="24">
                  <el-form-item label="遗留内容：" prop="content">
                    <el-input v-model="feedbackForm[1].content" placeholder="请输入遗留内容" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="解决时间：" prop="solveTime">
                    <el-date-picker type="date" v-model="feedbackForm[1].solveTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                      :style="{width: '100%'}" placeholder="解决时间" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer" v-loading="loading">
              <el-button type="primary" @click="feedbackSave(2)">提 交</el-button>
              <el-button @click="cancel">重 置</el-button>
            </div>
          </el-dialog>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="流程" name="flow">
        <el-table :data="histroryData" border class="history-table">
          <el-table-column type="index" :index="setIndex" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="processName" label="流程名称" align="center">
          </el-table-column>
          <el-table-column prop="nickName" label="办理人" align="center">
          </el-table-column>
          <el-table-column prop="status" label="审核结果" align="center" :formatter="setStatus">
          </el-table-column>
          <el-table-column prop="opinions" label="审核意见" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="审核时间" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import {
    checkPermi,
    checkRole
  } from "@/utils/permission"; // 权限判断函数
  import baseInfo from "../profile/baseInfo";
  import {
    getUserProfile
  } from "@/api/system/user";
  import {
    getOverhaulInfo,
    upload,
    history,
    realTimeStatusList,
    receiveApproval,
    feedbackList,
    feedbackSave,
    feedbackRemove
  } from "@/api/overhaul/overhaulInfo";

  export default {
    components: {
      baseInfo
    },
    data() {
      return {
        step: null,
        programId: '',
        user: {},
        newStatus:null,
        activeName: 'basemessage',
        activeNames: ['1', '2', '3'],
        readonly: true,
        histroryData: [],
        resData: [],
        resData2: [],
        dateRange: [],
        feedbackComplete: 0,
        inside:0,//是否为本单位 0计划性检修   1外单位 非计划性检修
        processInfos: [{
            nickName: '',
            phoneNumber: '',
            createTime: ''
          },
          {
            nickName: '',
            phoneNumber: '',
            createTime: ''
          },
          {
            nickName: '',
            phoneNumber: '',
            createTime: ''
          }
        ],
        feedbackTable: [
          [],
          []
        ],
        feedbackFormOpen1: false,
        feedbackFormOpen2: false,
        feedbackForm: [{
            content: '',
            complete: ''
          },
          {
            content: '',
            solveTime: ''
          }
        ],
        feedbackTitle: ["作业内容", "遗留内容"],
        feedbackFormTitle: ["", ""],
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 表单参数
        form: {},
        // 表单校验
        feedbackRules0: {
          content: [{
            required: true,
            message: "作业内容不能为空",
            trigger: "blur"
          }],
          complete: [{
            required: true,
            message: "执行情况不能为空",
            trigger: "blur"
          }]
        },
        feedbackRules1: {
          content: [{
            required: true,
            message: "遗留内容不能为空",
            trigger: "blur"
          }],
          solveTime: [{
            required: true,
            message: "解决时间不能为空",
            trigger: "blur"
          }]
        },
      };
    },
    created() {
      this.fetchData();
      this.getUser();
      this.getBaseInfo();
      this.history();
      this.realTimeStatusList();
      this.feedbackList(1);
      this.feedbackList(2);
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData',
      step() {
        // if (this.step === 0) {
        //   if (checkRole(['process_plan_deptManager'])) {
        //     this.processInfos[0].nickName = this.user.nickName;
        //     this.processInfos[0].phoneNumber = this.user.phonenumber;
        //   }
        // }
        console.log(this.step)
        if (this.step === 0) {
          if (checkRole(['process_plan_dispatchingCenter'])) {
            this.processInfos[1].nickName = this.user.nickName;
            this.processInfos[1].phoneNumber = this.user.phonenumber;
          }
        }
        if (this.step === 2) {
          if (checkRole(['process_plan_disCenterManager'])) {
            this.processInfos[2].nickName = this.user.nickName;
            this.processInfos[2].phoneNumber = this.user.phonenumber;
          }
        }
        console.log(this.processInfos)
      }
    },
    methods: {
      fetchData() {
        this.programId = this.$route.query.id;
        this.inside = this.$route.query.inside;
        this.activeName = this.$route.query.active || 'basemessage';
      },
      checkPermi,
      checkRole,
      // 用户信息
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
        });
      },
      //基本信息
      getBaseInfo() {
        // const  id=this.$route.query.row.id;
        const id = this.programId;
        getOverhaulInfo(id).then(response => {
          this.form = response.data;
        });
      },
      //流程
      history() {
        let data = {
          id: this.programId
        };
        history(data).then(response => {
          this.histroryData = response.data;
        });
      },
      //审核信息
      realTimeStatusList() {
        let data = {
          id: this.programId
        };
        realTimeStatusList(data).then(response => {
          if (response.code === 200) {
            let feedbackComplete = response.rows[0].feedbackComplete;
            if (feedbackComplete != null) {
              this.feedbackComplete = feedbackComplete + '';
            } else {
              this.feedbackComplete = feedbackComplete;
            }
            this.newStatus= feedbackComplete;//完结后是否全部完成禁用
           let info = response.rows[0];
            var processInfos = info.processInfos;
            processInfos.map((item, i) => {
              if (i > 0&&item.currentProgress!=-1) {
                this.processInfos[i] = item;
              }
              if (i === 2) {
                this.processInfos[i - 1].permissionStart = response.rows[0].permissionStart;
                this.processInfos[i - 1].permissionEnd = response.rows[0].permissionEnd;
              }
              if(item.status!=0){
              this.step = item.currentProgress;
              }
            })
          }
        });
      },
      // 审核
      receiveApproval(type) {
        var title = '';
        var text = ["驳回", "提交"];
        let data = {
          id: this.programId,
          result: type,
          inside: this.inside,
        };
        // if (this.step === 0) {
        //   data.status = 1;
        //   title = text[type] + "发起部门审核人审核";
        //   data.reason = this.processInfos[0].opinions;
        // }
        if (this.step === 0) {
          data.status = 2;
          title = text[type] + "综合调度审核";
          data.reason = this.processInfos[1].opinions;
          // if(this.processInfos[1].permissionStart&&this.processInfos[1].permissionEnd) {
          //   data.permissionStart = this.processInfos[1].permissionStart + " 00:00:00";
          //   data.permissionEnd = this.processInfos[1].permissionEnd + " 00:00:00";
          if (this.dateRange.length === 2) {
            data.permissionStart = this.dateRange[0] + " 00:00:00";
            data.permissionEnd = this.dateRange[1] + " 00:00:00";
          } else if(type == 1){
            this.msgError("许可时间不能为空！")
            return;
          }
        }
        if (this.step === 2) {
          data.status = 3;
          title = text[type] + "调度运行中心部门审核";
          data.reason = this.processInfos[2].opinions;
        }
        if (this.step === 3) {
          data.status = 4;
          title = "提交作业反馈";
          if (this.feedbackComplete) {
            data.feedbackComplete = this.feedbackComplete;
          } else {
            this.msgError("请选择预期作业方案是否全部完成！")
            return;
          }
        }
        this.$confirm('是否确认' + title + '结果?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return receiveApproval(data);
        }).then(response => {
          // if (this.step === 3) {
            this.activeName = 'flow'
          // }
          this.realTimeStatusList();
          this.history()
          this.msgSuccess(response.msg);
        }).
        catch(function() {});
      },
      // 状态(撤销：-1，审批中：0, 驳回：1， 进行中：2，完成：3)字典翻译
      statusFormat(row, column) {
        var status = ["未完成", "完成"];
        return status[row.complete];
      },
      //检修反馈列表
      feedbackList(type) {
        const id = this.programId;
        let data = {
          programId: id,
          type: type,
        };
        feedbackList(data).then(response => {
          if (response.code === 200) {
            this.$set(this.feedbackTable, type - 1, response.rows);
          }
        });
      },
      feedbackAdd(type) {
        this.resetFeedbackForm();
        if (type == 1) {
          this.feedbackFormOpen1 = true;
        } else {
          this.feedbackFormOpen2 = true;
        }
        this.feedbackFormTitle[type - 1] = "添加" + this.feedbackTitle[type - 1];
      },
      feedbackUpdate(type, row) {
        this.resetFeedbackForm();
        if (type == 1) {
          this.feedbackFormOpen1 = true;
          this.$set(this.feedbackForm[type - 1], 'id', row.id);
          this.$set(this.feedbackForm[type - 1], 'content', row.content);
          this.$set(this.feedbackForm[type - 1], 'complete', row.complete);
        } else {
          this.feedbackFormOpen2 = true;
          this.$set(this.feedbackForm[type - 1], 'id', row.id);
          this.$set(this.feedbackForm[type - 1], 'content', row.content);
          this.$set(this.feedbackForm[type - 1], 'solveTime', row.solveTime);
        }

        this.feedbackFormTitle[type - 1] = "修改" + this.feedbackTitle[type - 1];
      },
      //检修反馈添加/更新
      feedbackSave(type) {
        this.$refs["feedbackForm" + type].validate(valid => {
          if (valid) {
            this.feedbackForm[type - 1].programId = this.programId;
            this.feedbackForm[type - 1].type = type;
            if (this.feedbackForm[type - 1].solveTime) {
              this.feedbackForm[type - 1].solveTime = this.feedbackForm[type - 1].solveTime + " 00:00:00";
            }
            this.loading = true;
            feedbackSave(this.feedbackForm[type - 1]).then(response => {
              if (response.code === 200) {
                this.msgSuccess("提交成功");
                if (type == 1) {
                  this.feedbackFormOpen1 = false;
                } else {
                  this.feedbackFormOpen2 = false;
                }
                this.feedbackList(type);
                this.history();
              }
              this.loading = false;
            });
          }
        });
      },
      //检修反馈删除
      feedbackRemove(type, row, index) {
        let data = {
          id: row.id,
        };
        this.$confirm('是否确认删除' + this.feedbackTitle[type - 1] + '序号为"' + (index + 1) + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return feedbackRemove(data)
        }).then(() => {
          this.feedbackList(type);
          this.msgSuccess("删除成功");
        }).
        catch(function() {});

      },
      resetFeedbackForm() {
        this.feedbackForm = [{
          content: '',
          complete: '',
        }, {
          content: '',
          solveTime: '',
        }];
        this.resetForm("resetFeedbackForm1");
        this.resetForm("resetFeedbackForm2");
      },
      // 取消按钮
      cancel() {
        // this.feedbackFormOpen = [false,false];
        this.resetFeedbackForm();
      },
      setIndex(index) {
        return index + 1;
      },
      setStatus(row) {
        var status = ["驳回", "通过", "已阅","撤销"];
        return status[row.status];
      },
    }
  };
</script>
