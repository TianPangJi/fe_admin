<template>
  <div class="app-container">
    <el-row>
      <el-col :span="17">
        <el-form ref="form" :model="form" inline>
          <el-form-item prop="search">
            <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search" placeholder="输入角色名、描述搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" size="medium" @click="search('search')">搜索</el-button>
            <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button v-permission="['admin','system-roles-add']" type="primary" style="margin-bottom:20px" icon="el-icon-plus" size="medium" @click="createRole()">新增</el-button>
        <el-button v-permission="['admin','system-roles-mdel']" type="danger" icon="el-icon-delete" :disabled="multipleSelection.length ? false : true" size="medium" @click="deleteRoles(form)">删除</el-button>
      </el-col>
      <el-col :span="7">
        <el-steps :active="step" finish-status="success" simple style="margin-top: 20px; padding:20px 2%">
          <el-step title="点击角色" />
          <el-step title="分配权限" />
          <el-step title="点击授权" />
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色列表</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            :row-key="getRowKeys"
            style="width: 100%"
            highlight-current-row
            @current-change="tableHandleCurrentChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              :selectable="checkSelectTable"
              width="55"
            />
            <el-table-column
              prop="name"
              label="角色"
            />
            <el-table-column
              prop="desc"
              label="描述"
            />
            <el-table-column
              prop="create_time"
              label="创建时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="220"
            >
              <template slot-scope="{row}">
                <el-button v-permission="['admin','system-roles-update']" type="primary" icon="el-icon-edit" size="mini" @click.native.stop="updateRole(row)">编辑</el-button>
                <el-button v-permission="['admin','system-roles-del']" type="danger" icon="el-icon-delete" size="mini" @click.native.stop="deleteRole(row)">删除</el-button>
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
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="permissions-box-card" style="margin-left:10px">
          <div slot="header" class="clearfix">
            <span>权限分配</span>
            <el-button v-permission="['admin','system-roles-auth']" :disabled="!showButton" type="primary" style="float: right" icon="el-icon-check" size="medium" @click="authorize()">授权</el-button>
          </div>
          <el-tree
            ref="permissions"
            :data="permissionsData"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="handleCheckClick"
          />
        </el-card>
      </el-col>
    </el-row>
    <cuForm :dialog-visible="cuDialogVisible" :cur-id="curId" @close="close" @search="search" />
  </div>
</template>
<script>
import cuForm from './components/cuForm'
import { getRoles, updateRolePermissions, deleteRole, deleteRoles } from '@/api/system/roles'
import { getPermissions } from '@/api/system/permissions'
export default {
  name: 'Roles',
  components: { cuForm },
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: '',
        ordering: 'id'
      },
      tableData: [],
      total: 0,
      multipleSelection: [],
      currentId: null,
      // 权限数部分数据
      step: 0,
      showButton: false,
      permissionsData: [],
      permissionIds: [],
      defaultProps: { children: 'children', label: 'label' },
      // cuForm数据
      cuDialogVisible: false,
      curId: null
    }
  },
  created() {
    this.search()
    this.getPermissions()
  },
  methods: {
    // 获取角色列表/搜索功能
    search(search) {
      if (search) {
        // 清空权限菜单部分数据
        this.showButton = false
        this.permissionIds = []
        this.$refs.permissions.setCheckedKeys([])
        this.changeDisabled(this.permissionsData, false)
        this.step = 0
        this.currentId = null
      }
      getRoles(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      this.search('search')
    },
    getRowKeys(row) {
      return row.id
    },
    // 获取Permissions Tree的所有ID
    getAllPermissionDataId(array, datas) {
      for (const index in datas) {
        const id = datas[index].id
        array.push(id)
        if (datas[index].children) {
          this.getAllPermissionDataId(array, datas[index].children)
        }
      }
      return array
    },
    // 更改Permissions Tree的disabled属性
    changeDisabled(data, disabled) {
      for (let index = 0; index < data.length; index++) {
        const children = data[index].children
        if (children !== undefined) {
          this.changeDisabled(children, disabled)
        }
        data[index].disabled = disabled
      }
    },
    // table选择框功能的change事件
    handleSelectionChange() {
      const deleteIds = []
      this.$refs.multipleTable.selection.forEach(data => deleteIds.push(data.id))
      this.multipleSelection = deleteIds
    },
    // 设置admin角色行不可勾选
    checkSelectTable(row) {
      return row.name !== 'admin'
    },
    // table单选触发单选
    tableHandleCurrentChange(val) {
      if (val) {
        // 清空菜单的选中
        this.$refs.permissions.setCheckedKeys([])
        if (val.name === 'admin') {
          this.changeDisabled(this.permissionsData, true)
          this.permissionIds = this.getAllPermissionDataId([], this.permissionsData)
          this.showButton = false
          this.step = 3
        } else {
          this.changeDisabled(this.permissionsData, false)
          // 保存当前的角色id
          this.currentId = val.id
          // 初始化默认选中的key
          this.permissionIds = val.permissions
          // 显示授权按钮
          this.showButton = true
          // 步骤显示
          this.step = 1
        }
      }
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将删除角色 "' + row.name + '" , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(res => {
          this.$message({
            message: '删除角色' + row.name + '成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 批量删除用户
    deleteRoles() {
      this.$confirm('此操作将删除选中角色' + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(this.multipleSelection).then(res => {
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
    // 获取权限数结构数据
    getPermissions() {
      getPermissions().then(res => {
        this.permissionsData = res.data.results
      })
    },
    // tree权限节点被点击时的回调
    handleCheckClick(currentObj, treeStatus) {
      if (this.currentId) {
        this.step = 2
      }
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children !== undefined) {
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.permissions.setChecked(treeList.id, isSelected)
      if (treeList.children !== undefined) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.permissions.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.permissions.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 角色授权
    authorize() {
      this.step = 3
      const permissionIds = this.$refs.permissions.getCheckedKeys()
      updateRolePermissions(this.currentId, permissionIds).then(res => {
        this.$message({
          message: '授权成功',
          type: 'success'
        })
        this.search()
      })
    },
    // cuForm子组件
    createRole() {
      this.cuDialogVisible = true
    },
    updateRole(row) {
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
<style lang="scss" scoped>
.permissions-box-card{
  ::v-deep{
    .el-card__body{
      max-height: 400px;
      overflow-y: auto;
    }
  }
}

</style>
