<template>
  <el-dialog :visible.sync="dialogVisible" title="修改密码" width="500px" :before-close="close">
    <el-form ref="ruleForm" label-position="left  " :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="old_password">
        <el-input v-model="ruleForm.old_password" type="password" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="ruleForm.confirm_password" type="password" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import store from '@/store'
import { changePassword } from '@/api/information/centre'
export default {
  name: 'UpdatePassword',
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.ruleForm.password !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入密码'))
      }
    }
    return {
      dialogVisible: false,
      ruleForm: {
        old_password: '',
        password: '',
        confirm_password: ''
      },
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirm_password: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePassword(this.ruleForm).then(res => {
            this.$message({
              message: '密码修改成功，请重新登录',
              type: 'success'
            })
            setTimeout(() => {
              store.dispatch('user/logout').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 1500)
          })
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
