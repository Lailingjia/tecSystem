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
      

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
</el-row> 
    </el-form>
   <el-table
    v-loading="loading" 
    :data="userList"
    border
    ref="el"
    style="width: 100%">
    <el-table-column
      fixed
      prop="time"
      label="日期"
      width="150">
    </el-table-column>

 <el-table-column v-for="(item, index) in deptOptions" :key="index" :label="item.name"  :prop="item.code"></el-table-column>

    
    
    <!-- <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <el-button @click="left" type="text" size="middle" >&lt;&lt;</el-button>
  
        <el-button @click="right" type="text" size="middle" >>></el-button>
  
    </el-table-column> -->
 <el-table-column
      fixed="right"
      width="100" >
      <template slot="header" slot-scope="scope">
         <el-button @click="left" type="text" size="middle" >&lt;&lt;</el-button>
  
        <el-button @click="right" type="text" size="middle" >>></el-button>
      </template>
     
    </el-table-column>
    
  </el-table>
    <pagination 
    v-show="total>0" 
        :total="total" 
        :page.sync="queryParams.pageNum" 
        :limit.sync="queryParams.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
import { listallrep,listuser } from "@/api/system/userrep";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      userList: [],
      // 日期范围
      codes:[],
     dateRange: ['',''],
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      item:"",
      currentPage:1,
     
    };
  },
  created() { 
this.getuser();
    this.getList();
   
  },
  methods: {
    
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listallrep({
          codes:this.item,
          beginTime:this.dateRange[0],
          endTime:this.dateRange[1],
           pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      })
      .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
  getuser() {
      listuser().then(response => {
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
right(){
  this.$nextTick(() => {
          this.$refs.el.bodyWrapper.scrollLeft +=140;
        })
},
left(){
  this.$nextTick(() => {
          this.$refs.el.bodyWrapper.scrollLeft -=140;
        })
}
  }
};
</script>
<style >
.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
    
}
</style>

