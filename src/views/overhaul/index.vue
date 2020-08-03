<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
        <el-date-picker type="datetimerange" v-model="dateRange" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :style="{width: '70%'}" start-placeholder="开始日期" end-placeholder="结束日期"
          range-separator="至" clearable  :picker-options="pickerOptions"></el-date-picker>
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['overhaul:overhaulInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['overhaul:overhaulInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['overhaul:overhaulInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['overhaul:overhaulInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="overhaulInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="组件自增" align="center" prop="id"  />
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
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
           <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleresource(scope.row)"
            v-hasPermi="['overhaul:overhaulInfo:list']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['overhaul:overhaulInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['overhaul:overhaulInfo:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改检修详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-row :gutter="21">
        <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="125px"
                 label-position="left">
          <el-col :span="8">
            <el-form-item label-width="-1px" label="作业名称：" prop="programName">
              <el-input v-model="form.programName" placeholder="请输入作业名称" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="-1px" label="申请单位：" prop="programName">
              <el-input v-model="form.companyName" placeholder="请输入申请单位" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="-1px" label="作业申请人：" prop="applicatName">
              <el-input v-model="form.applicatName" placeholder="请输入申请人" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="-1px" label="申请人联系方式：" prop="tel" >
                <el-input v-model="form.tel" placeholder="请输入申请人电话" clearable
                          ></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label-width="-1px" label="申请日期：" prop="Time" >
              <el-date-picker type="date" v-model="form.Time" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="选择申请时间" style="width:300px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="-1px" label="申请事由：" prop="reason" >
              <el-input v-model="form.reason"  placeholder="请输入申请事由"
                        :rows="2" ></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
            <el-form-item label-width="-1px" label="作业影响范围：" prop="infulenceArea" >
              <el-input v-model="form.infulenceArea" placeholder="请输入作业影响范围" clearable
                        ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label-width="-1px" label="影响开始时间：" prop="infulenceTime" >
              <el-date-picker type="date" v-model="form.infulenceBeginTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="影响开始时间" style="width:300px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label-width="-1px" label="影响结束时间：" prop="infulenceTime" >
              <el-date-picker type="date" v-model="form.infulenceEndTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="影响结束时间" style="width:300px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="16" style="position: relative;">
            <el-form-item label-width="-1px" label="作业方案：" prop="planInfo" >
              <el-input v-model="form.planInfo" type="textarea" placeholder="请输入作业方案"
                        :autosize="{minRows: 5, maxRows: 5}" :style="{width: '100%'}"></el-input>
            </el-form-item>
             <el-form-item style="position: absolute;top: -10px;right:10px;">
               <el-upload ref="planAnnexAddr" :file-list="planAnnexAddrfileList" :action="planAnnexAddrAction"
                          :before-upload="planAnnexAddrBeforeUpload">
                 <el-button size="small" type="warning" icon="el-icon-upload" >导入作业方案</el-button>
               </el-upload>
             </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label-width="-1px" label="计划开始时间：" prop="PlanTime" >
              <el-date-picker type="date" v-model="form.workBeginTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划开始时间"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label-width="-1px" label="计划结束时间：" prop="PlanTime" >
              <el-date-picker type="date" v-model="form.workEndTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划结束时间"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" style="width:150px">提 交</el-button>
        <el-button @click="cancel" style="width:150px">重 置</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="1000px" append-to-body @close="open2 = false" :fullscreen="true">
      <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basemessage">
      <el-row :gutter="21" style="position:relative;left:5px;">
        <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="125px"
                 label-position="left">
          <el-col :span="7">
            <el-form-item label-width="-1px" label="作业名称：" prop="programName">
              <el-input v-model="form.programName" placeholder="请输入作业名称" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="-1px" label="申请单位：" prop="programName">
              <el-input v-model="form.companyName" placeholder="请输入申请单位" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="-1px" label="作业申请人：" prop="applicatName">
              <el-input v-model="form.applicatName" placeholder="请输入申请人" clearable
                        ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="-1px" label="申请人联系方式：" prop="tel" >
                <el-input v-model="form.tel" placeholder="请输入申请人电话" clearable
                          ></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="7">
            <el-form-item label-width="-1px" label="申请日期：" prop="Time" >
              <el-date-picker type="date" v-model="form.Time" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="选择申请时间" style="width:570px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="-1px" label="申请事由：" prop="reason" >
              <el-input v-model="form.reason"  placeholder="请输入申请事由"
                        :rows="2" ></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="7">
            <el-form-item label-width="-1px" label="作业影响范围：" prop="infulenceArea" >
              <el-input v-model="form.infulenceArea" placeholder="请输入作业影响范围" clearable
                        ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label-width="-1px" label="影响开始时间：" prop="infulenceTime" >
              <el-date-picker type="date" v-model="form.infulenceBeginTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="影响开始时间" style="width:570px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="7">
            <el-form-item label-width="-1px" label="影响结束时间：" prop="infulenceTime" >
              <el-date-picker type="date" v-model="form.infulenceEndTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"  placeholder="影响结束时间" style="width:570px"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="14">
            <el-form-item label-width="-1px" label="作业方案：" prop="planInfo" >
              <el-input v-model="form.planInfo" type="textarea" placeholder="请输入作业方案"
                        :autosize="{minRows: 5, maxRows: 5}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="height:30px;position:relative;left:-300px;top:-10px">
            <el-form-item >
              <el-upload ref="planAnnexAddr" :file-list="planAnnexAddrfileList" :action="planAnnexAddrAction"
                         :before-upload="planAnnexAddrBeforeUpload">
                 <el-button type="warning" icon="el-icon-download" @click="handleExport" v-hasPermi="['business:overhaulInfo:export']" >
                   导出作业方案</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
           <el-col :span="7" style="position:relative;top:-30px;">
            <el-form-item label-width="-1px" label="计划开始时间：" prop="PlanTime" >
              <el-date-picker type="date" v-model="form.workBeginTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划开始时间"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="7" style="position:relative;top:-50px;">
            <el-form-item label-width="-1px" label="计划结束时间：" prop="PlanTime" >
              <el-date-picker type="date" v-model="form.workEndTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="计划结束时间"
                               clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      </el-tab-pane>


    <el-tab-pane label="审批" name="check">
      <el-collapse>
  <el-collapse-item>
    <template slot="title" style="display:flex;">
      <div class="title" style="font-size:18px;flex:1;padding-left:50px;"><b>发起部门审核人审核</b></div>
      <div class="bt" >
      <el-button type="primary" icon="el-icon-check">提交</el-button>
      <el-button type="danger" icon="el-icon-close">打回</el-button>
      <el-button type="success" icon="el-icon-back">返回</el-button>
      </div>
    </template>

    <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:50px;top:50px;"><b>部门审核人：</b></p></div>
    <div><p style="font-size:18px;width:350px;text-align:left;position:relative;left:50px;top:70px;"><b>确认基本信息、操作流程无误。</b></p></div>
    <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:500px;top:-50px;"><b>联系电话:</b></p></div>
    <div><p style="font-size:18px;width:550px;text-align:left;position:relative;left:900px;top:-100px;">
      <b>审核时间：____年____月____日____时____分____</b></p></div>
      <div style="width:400px;height:60px;position:relative;left:970px;top:-80px;">
        <p style="font-size:20px;width:100px;text-align:left;"><b>备注:</b></p>
        <el-input v-model="inputxx" style="width:300px;position:relative;left:70px;top:-55px;"></el-input>
      </div>
  </el-collapse-item>
  <el-collapse-item>
    <template slot="title" style="display:flex;">
      <div class="title" style="font-size:18px;flex:1;padding-left:50px;"><b>综合调度审核</b></div>
      <div class="bt" >
        <el-button type="primary" icon="el-icon-check">提交</el-button>
        <el-button type="danger" icon="el-icon-close">打回</el-button>
         <el-button type="success" icon="el-icon-back">返回</el-button>
      </div>
    </template>

   <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:50px;top:50px;"><b>部门审核人：</b></p></div>
   <div style="width:400px;height:60px;">
     <p style="font-size:18px;width:150px;text-align:left;position:relative;top:100px;left:50px;"><b>许可开始时间：</b></p>
    <div class="datapick" style="position:relative;left:180px;top:50px;">
    <el-date-picker
      v-model="value1"
      type="date"
    >
    </el-date-picker>
  </div>
   </div>

     <div style="width:400px;height:60px;">
     <p style="font-size:18px;width:150px;text-align:left;position:relative;top:30px;left:900px;"><b>许可结束时间：</b></p>
    <div class="datapick" style="position:relative;left:1030px;top:-20px;">
    <el-date-picker
      v-model="value1"
      type="date"
    >
    </el-date-picker>
  </div>
   </div>
    <div><p style="font-size:18px;width:450px;text-align:left;position:relative;left:50px;top:70px;"><b>确认基本信息、操作流程无误、经审核同意检修计划。</b></p></div>
    <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:500px;top:-200px;"><b>联系电话:</b></p></div>
    <div><p style="font-size:18px;width:550px;text-align:left;position:relative;left:900px;top:-250px;">
      <b>审核时间：____年____月____日____时____分____</b></p></div>
      <div style="width:400px;height:60px;position:relative;left:970px;top:-80px;">
        <p style="font-size:20px;width:100px;text-align:left;"><b>备注:</b></p>
        <el-input v-model="inputxx" style="width:300px;position:relative;left:70px;top:-55px;"></el-input>
      </div>
  </el-collapse-item>
  <el-collapse-item>
    <template slot="title" style="display:flex;">
      <div class="title" style="font-size:18px;flex:1;padding-left:50px;"><b>调度运行中心部门审核</b></div>
      <div class="bt" >
        <el-button type="primary" icon="el-icon-check">提交</el-button>
        <el-button type="danger" icon="el-icon-close">打回</el-button>
         <el-button type="success" icon="el-icon-back">返回</el-button>
      </div>
    </template>

     <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:50px;top:50px;"><b>部门审核人：</b></p></div>
    <div><p style="font-size:18px;width:450px;text-align:left;position:relative;left:50px;top:70px;"><b>确认基本信息、操作流程无误、经审核同意检修计划。</b></p></div>
    <div><p style="font-size:18px;width:150px;text-align:left;position:relative;left:500px;top:-50px;"><b>联系电话:</b></p></div>
    <div><p style="font-size:18px;width:550px;text-align:left;position:relative;left:900px;top:-100px;">
      <b>审核时间：____年____月____日____时____分____</b></p></div>
      <div style="width:400px;height:60px;position:relative;left:970px;top:-80px;">
        <p style="font-size:20px;width:100px;text-align:left;"><b>备注:</b></p>
        <el-input v-model="inputxx" style="width:300px;position:relative;left:70px;top:-55px;"></el-input>
      </div>
  </el-collapse-item>

</el-collapse>
    </el-tab-pane>


    <el-tab-pane label="反馈" name="response">
    <el-row :gutter="12">
  <el-col :span="24">
    <el-card shadow="always" >
     <b style="font-size:20px;position:relative;top:10px;">预期作业方案是否全部完成</b>
     <div style="position:relative;left:260px;top:-10px">
       <el-checkbox v-model="checked"></el-checkbox>
     </div>

    </el-card>
  </el-col>
   <el-col :span="24" style="margin-top:50px;margin-bottom:50px;">
    <el-card shadow="always">
      <b style="font-size:20px;position:relative;top:15px;">具体完成作业内容</b>
      <div style="float:right;">
        <el-button type="primary" icon="el-icon-plus">添加</el-button>
      </div>

    </el-card>
  </el-col>
  <div class="restab1" style="margin-top:40px;position:relative;left:150px;">
     <el-table v-loading="loading" :data="resData" border style="width: 85%">
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="作业内容" align="center" prop="programName" />
      <el-table-column label="执行情况" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"

            @click="handleUpdate(scope.row)"
            v-hasPermi="['']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"

            @click="handleDelete(scope.row)"
            v-hasPermi="['']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-col :span="24" style="margin-top:50px;margin-bottom:50px;">
    <el-card shadow="always">
      <b style="font-size:20px;position:relative;top:15px;">遗留问题</b>
      <div style="float:right;">
        <el-button type="primary" icon="el-icon-plus">添加</el-button>
      </div>

    </el-card>
  </el-col>

   <div class="restab2" style="margin-top:40px;position:relative;left:150px;">
     <el-table v-loading="loading" :data="resData2" border style="width: 85%">
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="遗留内容" align="center" prop="programName" />
      <el-table-column label="解决时间" align="center" prop="workEndTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"

            @click="handleUpdate(scope.row)"
            v-hasPermi="['']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"

            @click="handleDelete(scope.row)"
            v-hasPermi="['']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</el-row>
    </el-tab-pane>
    <el-tab-pane label="流程" name="flow">
    <el-table :data="tableData" border >
    <el-table-column
      prop="num"
      label="序号"
      width="60"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="flowpro"
      label="流程名称"
      width="350"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="person"
      label="办理人"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="result"
      label="审核结果"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="suggest"
      label="审核意见"
      width="350"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="shtime"
      label="审核时间"
      width="350"
      align="center" >
    </el-table-column>
  </el-table>
  </el-tab-pane>
  </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
import { listOverhaulInfo, getOverhaulInfo, delOverhaulInfo, addOverhaulInfo, updateOverhaulInfo } from "@/api/overhaul/overhaulInfo";

export default {
  name: "OverhaulInfo",
  checked:false,
  data() {
    return {
       activeName: 'basemessage',
       tableData: [{
          num: '1',
          flowpro: 'xxxx',
          person: 'xxx',
          result:'ok',
          suggest:'xx',
          shtime:'xxx-xx'
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
      open2:false,
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
      form: {
      },
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
      planAnnexAddrfileList:[],
      //文件列表   fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},]
      planAnnexAddrAction:'/',
      //https://jsonplaceholder.typicode.com/posts/
    };
  },
  created() {
    this.getList();
    this.getDicts("overhaul_info_status").then(response => {
      this.statusOptions = response.data;
  });
  },
  methods: {
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
      this.open = false;
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
        workTime:undefined,
        infulenceTime:undefined
      };
      this.resetForm("form");
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
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
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.workTime!=undefined){
            this.form.workBeginTime=this.form.workTime[0];
            this.form.workEndTime=this.form.workTime[1];
          }
          if(this.form.infulenceTime!=undefined){
            this.form.infulenceBeginTime=this.form.infulenceTime[0];
            this.form.infulenceEndTime=this.form.infulenceTime[1];
          }
          if (this.form.id != undefined) {
            updateOverhaulInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {

            addOverhaulInfo(this.form).then(response => {
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
      this.reset();
      const id = row.id || this.ids
      getOverhaulInfo(id).then(response => {
        this.form = response.data;
        this.open2 = true;

      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('overhaul/overhaulInfo/export', {
        ...this.queryParams
      }, `overhaul_overhaulInfo.xlsx`)
    },
    planAnnexAddrBeforeUpload(){

    }
  }
};
</script>
<style>

.line{
  position: relative;
  top: -22px;
  display: none;
}
.el-tabs__item{
  font-size: 20px ;
}
.el-collapse-item__header{
height: 68px;
background-color: rgba(212, 211, 211, 0.301);
border-radius: 5px;
}
.el-icon-arrow-right:before {
    display: none;
}
.el-card__body{
  height: 80px;
}
</style>
