<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>CRUD日志</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
            />
            <el-table-column
              prop="event_type_display"
              label="动作类型"
              width="100"
            />
            <el-table-column
              prop="datetime"
              label="动作时间"
              width="200"
            />
            <el-table-column
              prop="username"
              label="操作用户"
            />
            <el-table-column
              prop="content_type_display"
              label="Model模型"
              show-overflow-tooltip
            />
            <el-table-column
              prop="object_id"
              label="模型ID"
              width="80"
              show-overflow-tooltip
            />
            <el-table-column
              prop="changed_fields"
              label="变更字段"
              show-overflow-tooltip
            />
          </el-table>
          <!--分页组件-->
          <el-pagination
            :current-page="1"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCRUD } from '@/api/monitor/crud'
export default {
  name: 'Roles',
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: ''
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.search()
  },
  methods: {
    // 获取CRUD日志列表
    search() {
      getCRUD(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      this.search()
    },
    // 分页
    handleSizeChange(val) {
      this.form.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.search()
    }
  }
}
</script>
