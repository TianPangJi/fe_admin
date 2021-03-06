<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="curId ? '编辑权限' : '新增权限'" width="700px" :before-close="close">
    <el-form ref="ruleForm" label-position="left  " :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="权限名" prop="name">
        <el-input v-model="ruleForm.name" clearable />
      </el-form-item>
      <el-form-item label="权限标识" prop="sign">
        <el-input v-model="ruleForm.sign" clearable />
      </el-form-item>
      <el-form-item label="是否为菜单" prop="menu">
        <el-switch
          v-model="ruleForm.menu"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <template v-if="ruleForm.menu===false">
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="ruleForm.method" clearable placeholder="选择请求方法">
            <el-option
              v-for="item in permissionMethods"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请求路径" prop="path">
          <el-input v-model="ruleForm.path" clearable />
        </el-form-item>
      </template>
      <el-form-item label="父权限" prop="pid">
        <treeselect
          v-model="ruleForm.pid"
          :options="permissions"
          style="width: 178px"
          placeholder="选择父权限"
        />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="ruleForm.desc" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getPermission, updatePermission, createPermission, getPermissionMethods } from '@/api/system/permissions'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'CuForm',
  components: { Treeselect },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
    permissions: {
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
        sign: '',
        menu: true,
        method: '',
        path: '',
        pid: null,
        desc: ''
      },
      permissionMethods: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '权限名不能为空' }],
        sign: [{ required: true, trigger: 'blur', message: '权限标识不能为空' }],
        menu: [{ required: true, trigger: 'blur', message: '是否为菜单不能为空' }],
        method: [{ required: true, trigger: 'blur', message: '请求方法不能为空' }],
        path: [{ required: true, trigger: 'blur', message: '请求路径不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getPermission(this.curId).then(res => {
            this.ruleForm = res.data
          })
        }
        // 获取请求方法
        this.getMethod()
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.method = ''
      this.ruleForm.path = ''
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    getMethod() {
      getPermissionMethods().then(res => {
        this.permissionMethods = res.data.results
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
            if (this.ruleForm.menu === true) {
              this.ruleForm.method = ''
              this.ruleForm.path = ''
            }
            updatePermission(this.curId, this.ruleForm).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            createPermission(this.ruleForm).then(res => {
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
      this.$refs[formName].resetFields()
    }
  }
}
</script>
