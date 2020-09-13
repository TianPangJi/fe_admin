<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">111</el-col>
      <el-col :span="20">
        <el-form ref="form" :model="form" inline>
          <el-form-item prop="search">
            <el-input v-model="form.search" style="width:300px" placeholder="输入用户名、姓名、手机号、邮箱搜索" />
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
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="createUser(form)">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="medium" @click="updateUser(form)">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteUsers(form)">删除</el-button>
        <!-- <el-button type="warning" icon="el-icon-download" size="medium" @click="reset(form)">导出</el-button> -->
        <el-table
          :data="tableData"
          style="width: 100%"
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
            prop="department"
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
              <el-switch
                v-model="row.is_active"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeIsActive(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="220"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateUser(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)">删除</el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUsers, updateUserActive, deleteUser } from '@/api/system/users'
export default {
  name: 'User',
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: '',
        is_active: '',
        ordering: 'id'
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.search()
  },
  methods: {
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
      this.search()
    },
    // 修改用户状态
    changeIsActive(row) {
      const message = row.is_active ? '激活' : '锁定'
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

    // 批量删除用户
    deleteUsers() {

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
<style lang="scss" scope>
// .el-input{
//   width:400px
// }

</style>
