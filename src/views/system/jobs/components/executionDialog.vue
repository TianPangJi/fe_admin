<template>
  <el-dialog title="执行记录" :visible.sync="executionDialogVisible" :before-close="close">
    <el-table :data="tableData">
      <el-table-column property="status" label="状态" width="150" />
      <el-table-column property="run_time" label="执行时间" width="200" />
      <el-table-column property="duration" label="耗时(s)" />
      <el-table-column property="exception" label="异常" show-overflow-tooltip />
      <el-table-column label="详情回溯">
        <template slot-scope="{row}">
          <el-link v-if="row.traceback" type="danger" @click="details(row)">详情回溯</el-link>
          <el-dialog append-to-body title="详情回溯" :visible.sync="detailsDialogVisible">
            <pre class="details">{{ errorDetails }}</pre>
          </el-dialog>
        </template>
      </el-table-column>
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
  </el-dialog>
</template>
<script>
import { getJobExecutions } from '@/api/system/jobs'
export default {
  name: 'ExecutionDialog',
  props: {
    executionDialogVisible: {
      type: Boolean,
      default: false
    },
    jobID: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: '',
        job__id: ''
      },
      tableData: [],
      total: 0,
      detailsDialogVisible: false,
      errorDetails: ''
    }
  },
  watch: {
    executionDialogVisible(v) {
      if (v) {
        if (this.jobID) {
          this.form.job__id = this.jobID
          this.search()
        }
      }
    }
  },
  methods: {
    close() {
      this.form = this.$options.data().form
      this.$emit('executionDialogClose')
    },
    search() {
      getJobExecutions(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    // 详情回溯Dialog
    details(row) {
      this.errorDetails = row.traceback
      this.detailsDialogVisible = true
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
<style lang="scss" scoped>
pre{
  white-space:pre-wrap;
  word-wrap: break-word
};
.errorPre{
  height: 60vh;
  overflow: auto;
}
</style>
