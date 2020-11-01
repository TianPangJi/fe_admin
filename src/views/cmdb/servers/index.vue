<template>
  <div class="app-container">
    <el-form ref="form" :model="form" inline>
      <el-form-item prop="search">
        <el-input v-model="form.search" clearable style="width:320px" prefix-icon="el-icon-search" placeholder="输入服务器名称、编号、IP搜索" />
      </el-form-item>
      <el-form-item prop="asset_status">
        <el-select v-model="form.asset_status" style="width:120px" clearable placeholder="状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-bottom:20px" icon="el-icon-plus" size="medium" @click="createServer()">新增</el-button>
    <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length ? false : true" size="medium" @click="deleteServers(form)">删除</el-button>
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px;"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="所在机房">
              <span>{{ props.row.idc }}</span>
            </el-form-item>
            <el-form-item label="所在机柜">
              <span>{{ props.row.cabinet_display }}</span>
            </el-form-item>
            <el-form-item label="用途">
              <span>{{ props.row.server.use }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.memo }}</span>
            </el-form-item>
            <el-form-item label="系统类型">
              <span>{{ props.row.server.server_system_type_display }}</span>
            </el-form-item>
            <el-form-item label="系统版本">
              <span>{{ props.row.server.model }}</span>
            </el-form-item>
            <el-form-item label="用户">
              <span v-for="(item,index) in props.row.server.accounts" :key="item.id">{{ index+1 }}、{{ item.username }}/{{ item.password }}/{{ item.port }}   </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="服务器名称"
        prop="name"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="设备编号"
        prop="sn"
        show-overflow-tooltip
      />
      <el-table-column
        label="类型"
        prop="server.server_type_display"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.server.server_type==='pm'" effect="plain">{{ row.server.server_type_display }}</el-tag>
          <el-tag v-else type="success" effect="plain">{{ row.server.server_type_display }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="系统"
        prop="server.server_system_type_display"
        show-overflow-tooltip
      />
      <el-table-column
        label="服务器状态"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.asset_status===0">{{ row.asset_status_display }}</el-tag>
          <el-tag v-else-if="row.asset_status===1" type="success">{{ row.asset_status_display }}</el-tag>
          <el-tag v-else-if="row.asset_status===2" type="info">{{ row.asset_status_display }}</el-tag>
          <el-tag v-else-if="row.asset_status===3" type="danger">{{ row.asset_status_display }}</el-tag>
          <el-tag v-else type="warning">{{ row.asset_status_display }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="IP"
        prop="manage_ip"
        show-overflow-tooltip
      />
      <el-table-column
        label="管理员"
        prop="admin_display"
        show-overflow-tooltip
      />
      <el-table-column
        label="到期时间"
        prop="expire_day"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="200"
      >
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateServer(row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteServer(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <cuForm :dialog-visible="cuDialogVisible" :cur-id="curId" :status-options="statusOptions" @close="close" @search="search" />
  </div>
</template>
<script>
import cuForm from './components/cuForm'
import { getServers, deleteServer, deleteServers } from '@/api/cmdb/servers'
import { getAssetsStatus } from '@/api/cmdb/assets'
export default {
  name: 'Permissions',
  components: { cuForm },
  data() {
    return {
      form: {
        search: '',
        ordering: '',
        asset_status: ''
      },
      tableData: [],
      statusOptions: [],
      multipleSelection: [],
      // cuForm数据
      cuDialogVisible: false,
      curId: null
    }
  },
  created() {
    this.search()
    this.getAssetsStatus()
  },
  methods: {
    // 获取服务器列表/搜索功能
    search() {
      getServers(this.form).then(res => {
        this.tableData = res.data.results
      })
    },
    // 获取服务器资产状态列表
    getAssetsStatus() {
      getAssetsStatus().then(res => {
        this.statusOptions = res.data.results
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      this.search()
    },
    // 删除服务器
    deleteServer(row) {
      this.$confirm('此操作将删除该服务器, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteServer(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 批量删除服务器
    deleteServers() {
      this.$confirm('此操作将删除选中服务器, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteServers(this.multipleSelection).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 选项改变时触发
    handleSelectionChange(val) {
      const deleteIds = []
      this.$refs.table.selection.forEach(data => deleteIds.push(data.id))
      this.multipleSelection = deleteIds
    },
    // cuForm子组件
    createServer() {
      this.cuDialogVisible = true
    },
    updateServer(row) {
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
.demo-table-expand {
font-size: 0;
}
.app-container ::v-deep .demo-table-expand label {
width: 90px;
color: #99a9bf;
}
.demo-table-expand .el-form-item {
margin-right: 0;
margin-bottom: 0;
width: 50%;
}
</style>
