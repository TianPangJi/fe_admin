<template>
  <el-dialog title="函数清单" :visible.sync="functionDialogVisible" :before-close="close">
    <el-table :data="tableData">
      <el-table-column property="name" label="函数名称" />
      <el-table-column property="desc" label="功能描述" />
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
import { getJobFunctions } from '@/api/system/jobs'
export default {
  name: 'FunctionDialog',
  props: {
    functionDialogVisible: {
      type: Boolean,
      default: false
    }
  },
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
    search() {
      getJobFunctions(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    close() {
      this.form = this.$options.data().form
      this.$emit('functionDialogClose')
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
