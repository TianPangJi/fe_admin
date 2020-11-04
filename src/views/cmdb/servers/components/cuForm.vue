<template>
  <el-dialog :visible.sync="dialogVisible" :title="curId ? '编辑服务器' : '新增服务器'" width="710px" :before-close="close">
    <el-form ref="ruleForm" inline label-position="left" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-card shadow="never">
        <el-form-item label="服务器名称" prop="name">
          <el-input v-model="ruleForm.name" clearable />
        </el-form-item>
        <el-form-item label="设备编号" prop="sn">
          <el-input v-model="ruleForm.sn" clearable />
        </el-form-item>
        <el-form-item label="IP" prop="manage_ip">
          <el-input v-model="ruleForm.manage_ip" clearable />
        </el-form-item>
        <el-form-item label="服务器状态" prop="asset_status">
          <el-select v-model="ruleForm.asset_status" clearable placeholder="选择服务器状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员" prop="admin">
          <el-select
            v-model="ruleForm.admin"
            clearable
            filterable
            remote
            placeholder="请输入用户名"
            :remote-method="getAssetsAdmin"
            :loading="loading"
          >
            <el-option
              v-for="item in adminOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间" prop="expire_day">
          <el-date-picker
            v-model="ruleForm.expire_day"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="expire_day"
          />
        </el-form-item>
        <el-form-item label="所在机柜" prop="cabinet">
          <!-- <el-input v-model="ruleForm.cabinet" clearable /> -->
          <el-cascader
            v-model="ruleForm.cabinet"
            :options="cabinetOptions"
            :props="{ expandTrigger: 'hover' }"
            clearable
            @change="cabinetHandleChange"
          />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="ruleForm.memo" clearable />
        </el-form-item>
      </el-card>
      <el-card shadow="never">
        <el-form-item label="类型" prop="server.server_type">
          <el-select v-model="ruleForm.server.server_type" clearable placeholder="选择服务器类型">
            <el-option
              v-for="item in serverTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型" prop="server.server_system_type">
          <el-select v-model="ruleForm.server.server_system_type" clearable placeholder="选择服务器系统类型">
            <el-option
              v-for="item in serverSystemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="系统版本" prop="server.model">
          <el-input v-model="ruleForm.server.model" clearable />
        </el-form-item>
        <el-form-item label="用途" prop="server.use">
          <el-input v-model="ruleForm.server.use" clearable />
        </el-form-item>
      </el-card>
      <el-card shadow="never">
        <div v-for="(account, index) in ruleForm.server.accounts" :key="index">
          <el-form-item
            label="用户名"
            :prop="'server.' + 'accounts.' + index + '.username'"
            :rules="{
              required: true, message: '用户名不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.username" clearable />
          </el-form-item>
          <el-form-item
            label="密码"
            :prop="'server.' + 'accounts.' + index + '.password'"
            :rules="{
              required: true, message: '密码不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.password" clearable />
          </el-form-item>
          <el-form-item
            label="端口"
            :prop="'server.' + 'accounts.' + index + '.port'"
            :rules="{
              required: true, message: '端口不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.port" clearable />
          </el-form-item>
          <el-button @click.prevent="removeAccount(account)">删除</el-button>
        </div>
        <el-button @click="addAccount">新增账户</el-button>
      </el-card>
      <el-form-item class="el-sub-button">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { createServer, updateServer, getServer, getServerType, getServerSystemType } from '@/api/cmdb/servers'
import { getAssetsAdmin, getIDCCabinetsTree } from '@/api/cmdb/assets'
import { validateIP } from '@/utils/rulesValidate'
export default {
  name: 'CuForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
    statusOptions: {
      type: Array,
      default: () => {
        return
      }
    }
  },

  data() {
    return {
      ruleForm: {
        name: '',
        sn: '',
        asset_status: null,
        manage_ip: '',
        admin: null,
        cabinet: null,
        expire_day: null,
        memo: '',
        server: {
          server_type: '',
          server_system_type: '',
          model: '',
          use: '',
          accounts: []
        }
      },
      loading: false,
      adminOptions: [],
      serverTypeOptions: [],
      serverSystemOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      cabinetOptions: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '服务器名不能为空' }],
        sn: [{ required: true, trigger: 'blur', message: '设备标号不能为空' }],
        manage_ip: [
          { required: true, trigger: 'blur', message: 'Ip不能为空' },
          { validator: validateIP, trigger: 'blur' }
        ],
        asset_status: [{ required: true, trigger: 'blur', message: '服务器状态不能为空' }],
        'server.server_type': [{ required: true, trigger: 'blur', message: '类型不能为空' }],
        'server.server_system_type': [{ required: true, trigger: 'blur', message: '系统类型不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getServer(this.curId).then(res => {
            this.ruleForm = res.data
            if (res.data.admin) {
              this.adminOptions = [{ id: res.data.admin, username: res.data.admin_display }]
            }
          })
        }
        this.getServerType()
        this.getServerSystemType()
        this.getIDCCabinetsTree()
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.server.accounts = []
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    // 获取服务器系统类型列表
    getServerSystemType() {
      getServerSystemType().then(res => {
        this.serverSystemOptions = res.data.results
      })
    },
    // 获取服务器类型列表
    getServerType() {
      getServerType().then(res => {
        this.serverTypeOptions = res.data.results
      })
    },
    // 获取机房机柜Tree结构数据
    getIDCCabinetsTree() {
      getIDCCabinetsTree().then(res => {
        this.cabinetOptions = res.data.results
      })
    },
    // 机房机柜级联选择器的change
    cabinetHandleChange(value) {
      if (value.length > 0) {
        this.ruleForm.cabinet = value[value.length - 1]
      } else {
        this.ruleForm.cabinet = null
      }
    },
    // 查找服务器管理员
    getAssetsAdmin(query) {
      if (query !== '') {
        this.loading = true
        getAssetsAdmin(query).then(res => {
          this.adminOptions = res.data.results
          this.loading = false
        })
      } else {
        this.adminOptions = []
      }
    },
    removeAccount(item) {
      var index = this.ruleForm.server.accounts.indexOf(item)
      if (index !== -1) {
        this.ruleForm.server.accounts.splice(index, 1)
      }
    },
    addAccount() {
      this.ruleForm.server.accounts.push({
        username: '',
        password: '',
        port: ''
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            if (!this.ruleForm.pid) {
              this.ruleForm.pid = null
            }
            updateServer(this.curId, this.ruleForm).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            createServer(this.ruleForm).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.search()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.curId) {
        getServer(this.curId).then(res => {
          this.ruleForm = res.data
        })
      } else {
        this.$refs[formName].resetFields()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-ruleForm ::v-deep .el-card__body {
    padding: 10px 10px 0 10px;
  }
.demo-ruleForm ::v-deep .el-card {
    margin-bottom: 10px;
  }
.el-sub-button{
 margin-left: 112px;
}
.expire_day{
  width: 200px;
}
</style>
