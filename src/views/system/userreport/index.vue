<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
<el-row >
        <el-col :span="4">
        <el-form-item label="日期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item >
          <el-select v-model="item" filterable placeholder="请选择用户">
    <el-option
      v-for="item in deptOptions"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
        </el-form-item>
     </el-col>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
</el-row> 
    </el-form>

<el-tabs v-model="activeName">
    <el-tab-pane label="统计表" name="table">

      <el-table v-loading="loading" :data="userList" >
      <el-table-column label="日期" align="center" prop="time" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申报量" prop="apply" :show-overflow-tooltip="true"  />
      <el-table-column label="审批量" prop="approval" :show-overflow-tooltip="true"  />
      <el-table-column label="实际用量" prop="actual" :show-overflow-tooltip="true"  />
       <el-table-column label="偏差" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.actual-scope.row.approval }}</span>
        </template>
      </el-table-column>
      <el-table-column label="偏差率" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.approval!=0?((scope.row.actual-scope.row.approval)/scope.row.approval).toFixed(2)+'%':'0'+'%' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination 
    v-show="total>0" 
        :total="total" 
        :page.sync="queryParams.pageNum" 
        :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    </el-tab-pane>
    <el-tab-pane label="走势图" name="pic">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>


    </el-tab-pane>
  </el-tabs>

    
  </div>

  
</template>

<script>
import { listuser ,listuserrep} from "@/api/system/userrep";
import { treeselect  } from "@/api/system/usermenu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import PanelGroup from '../../dashboard/PanelGroup'
import LineChart from '../../dashboard/LineChart'
const lineChartData = {
  newVisitis: {
    approval: [100, 120, 161, 134, 105, 160, 165],
    actual: [120, 82, 91, 154, 162, 140, 145]
  },
}
export default {
  name: "Role",
   components: {
    Treeselect, 
    PanelGroup,
    LineChart, },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      userList: [],
      // 日期范围
      dateRange: ['',''],
      // 部门树选项
      codes:[],
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      item:"",
      currentPage:1,
      actual:[],
      activeName: 'table',
      lineChartData: lineChartData.newVisitis,
    };
  },
  created() { 
    this.getTreeselect();
    this.getList();
   
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listuserrep({
          codes:this.item,
          beginTime:this.dateRange[0],
          endTime:this.dateRange[1],
           pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      })
      .then(response => {
          this.userList = response.rows;
          // this.actual = this.userList.actual;
          // console.log("00000");
          // console.log(this.actual);
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.rows;
      });
    },
   
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.item="";
      this.handleQuery();
    },
   
  }
};
</script>


