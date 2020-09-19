<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-input v-model="filterText" clearable style="width:90%; margin-bottom: 20px;" prefix-icon="el-icon-search" placeholder="输入部门名称搜索" />
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="departmentsData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20">
        <el-form ref="form" :model="form" inline>
          <el-form-item prop="search">
            <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search" placeholder="输入用户名、姓名、手机号、邮箱搜索" />
          </el-form-item>
          <el-form-item prop="is_active">
            <el-select v-model="form.is_active" style="width:100px" clearable placeholder="状态">
              <el-option label="激活" value="true" />
              <el-option label="锁定" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
            <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="createUser()">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length ? false : true" size="medium" @click="deleteUsers(form)">删除</el-button>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="username"
            label="用户名"
          />
          <el-table-column
            prop="name"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            label="电话"
            width="180"
          />
          <el-table-column
            prop="email"
            label="邮箱"
            width="180"
          />
          <el-table-column
            prop="department_name"
            label="部门"
          />
          <el-table-column
            prop="date_joined"
            label="创建时间"
            width="180"
          />
          <el-table-column
            label="状态"
            align="center"
            width="100"
          >
            <template slot-scope="{row}">
              <!-- v-model="row.is_active" -->
              <el-switch
                v-model="row.is_active"
                :disabled="row.id === userId"
                :active-value="true"
                :inactive-value="false"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeIsActive($event, row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="220"
          >
            <template slot-scope="{row}">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateUser(row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <cuForm :dialog-visible="cuDialogVisible" :departments-data="departmentsData" :cur-id="curId" @close="close" @search="search" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import cuForm from './components/cuForm'
import { getUsers, updateUserActive, deleteUser, deleteUsers } from '@/api/system/users'
import { getDepartments } from '@/api/system/departments'
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  components: { cuForm },
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: '',
        is_active: '',
        ordering: 'id',
        department_id: ''
      },
      tableData: [],
      total: 0,
      multipleSelection: [], // 已选择的用户id数组
      filterText: '',
      departmentsData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 以下为cuForm子组件数据
      cuDialogVisible: false,
      curId: null
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.search()
    this.getDepartments()
  },
  methods: {
    // 获取部门Tree结构
    getDepartments() {
      getDepartments().then(res => {
        this.departmentsData = res.data.results
      })
    },
    // 部门Tree过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 过滤部门下的用户列表
    handleNodeClick(data) {
      this.form.department_id = data.id
      this.search()
    },
    // 获取用户列表/搜索功能
    search() {
      getUsers(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      // form中未使用department_id字段需手动清除
      this.form.department_id = ''
      this.search()
    },
    // 修改用户状态
    changeIsActive(event, row) {
      const message = !event ? '锁定' : '激活'
      this.$confirm('此操作将' + message + '用户 "' + row.username + '" , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'is_active': row.is_active }
        updateUserActive(row.id, data).then(res => {
          this.$message({
            message: message + row.username + '成功',
            type: 'success'
          })
        }).catch(() => {
          row.is_active = !row.is_active
        })
      }).catch(() => {
        row.is_active = !row.is_active
      })
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm('此操作将删除用户 "' + row.username + '" , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          this.$message({
            message: '删除用户' + row.username + '成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },

    // table选择功能的change事件
    handleSelectionChange() {
      const deleteIds = []
      this.$refs.multipleTable.selection.forEach(data => deleteIds.push(data.id))
      this.multipleSelection = deleteIds
      console.log(this.multipleSelection)
    },

    // 批量删除用户
    deleteUsers() {
      this.$confirm('此操作将删除用户' + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers({ 'ids': this.multipleSelection }).then(res => {
          this.$message({
            message: '删除用户成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 分页
    handleSizeChange(val) {
      this.form.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.search()
    },
    // cuForm子组件
    createUser() {
      this.cuDialogVisible = true
    },
    updateUser(row) {
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
<style lang="scss" scope>
// .el-input{
//   width:400px
// }

</style>
