<template>
  <div class="app-container">
    <el-form ref="form" :model="form" inline>
      <el-form-item prop="search">
        <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search" placeholder="输入部门名称搜索" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button v-permission="['admin','system-departments-add']" type="primary" style="margin-bottom:20px" icon="el-icon-plus" size="medium" @click="createDepartment()">新增</el-button>
    <el-button v-permission="['admin','system-departments-mdel']" type="danger" icon="el-icon-delete" :disabled="multipleSelection.length ? false : true" size="medium" @click="deleteDepartments(form)">删除</el-button>
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @select-all="selectAllChange"
      @selection-change="handleSelectionChange"
      @select="selectChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="部门"
      />
      <el-table-column
        prop="create_time"
        label="创建时间"
      />
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="220"
      >
        <template slot-scope="{row}">
          <el-button v-permission="['admin','system-departments-update']" type="primary" icon="el-icon-edit" size="mini" @click="updateDepartment(row)">编辑</el-button>
          <el-button v-permission="['admin','system-departments-del']" type="danger" icon="el-icon-delete" size="mini" @click="deleteDepartment(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <cuForm :dialog-visible="cuDialogVisible" :cur-id="curId" :departments="tableData" @close="close" @search="search" />
  </div>
</template>
<script>
import cuForm from './components/cuForm'
import { getDepartments, deleteDepartment, deleteDepartments } from '@/api/system/departments'
export default {
  name: 'Departments',
  components: { cuForm },
  data() {
    return {
      form: {
        search: '',
        ordering: 'id'
      },
      tableData: [],
      isAllSelect: false,
      multipleSelection: [],
      // cuForm数据
      cuDialogVisible: false,
      curId: null
    }
  },
  created() {
    this.search()
  },
  methods: {
    // 获取部门Tree列表/搜索功能
    search() {
      getDepartments(this.form).then(res => {
        this.tableData = res.data.results
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      this.search()
    },
    // 删除部门
    deleteDepartment(row) {
      this.$confirm('此操作将删除部门 "' + row.name + '" 及其子部门' + ' , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment(row.id).then(res => {
          this.$message({
            message: '删除部门' + row.name + '成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 批量删除部门
    deleteDepartments() {
      this.$confirm('此操作将删除选中部门及其子部门' + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartments(this.multipleSelection).then(res => {
          this.$message({
            message: '删除部门成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // table全选事件
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中所有子节点，否则就清空
      console.log(selection)
      if (selection && selection.length === this.tableData.length && selection[0].id === this.tableData[0].id) {
        selection.forEach(val => {
          this.selectChange(selection, val)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
    // 选项框点击事件
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.indexOf(row) !== -1) {
        if (row.children) {
          row.children.forEach(val => {
            selection.push(val)
            this.$refs.table.toggleRowSelection(val, true)
            this.selectChange(selection, val)
          })
        }
      } else {
        this.reverseRowSelection(selection, row)
      }
    },
    // 取消选择
    reverseRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          this.$refs.table.toggleRowSelection(val, false)
          if (val.children) {
            this.reverseRowSelection(selection, val)
          }
        })
      }
    },
    // 选项改变时触发
    handleSelectionChange(val) {
      const deleteIds = []
      this.$refs.table.selection.forEach(data => deleteIds.push(data.id))
      this.multipleSelection = deleteIds
    },
    // cuForm子组件
    createDepartment() {
      this.cuDialogVisible = true
    },
    updateDepartment(row) {
      this.curId = row.id
      this.cuDialogVisible = true
    },
    close() {
      this.cuDialogVisible = false
      this.curId = null
    }
  }
}
</script>
