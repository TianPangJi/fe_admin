<template>
  <el-dialog :visible.sync="dialogVisible" title="新增调度任务" width="700px" :before-close="close">
    <el-form ref="ruleForm" label-position="left  " :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="函数名称" prop="name">
        <el-select
          v-model="ruleForm.name"
          clearable
          filterable
          remote
          placeholder="请输入调度函数名称"
          :remote-method="getJobFunction"
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
      <el-form-item label="Cron表达式" prop="cron">
        <el-input v-model="ruleForm.cron" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getIp, updateIp, createIp } from '@/api/monitor/ip'
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
    }
  },

  data() {
    return {
      ruleForm: {
        ip: ''
      },
      rules: {
        ip: [{ required: true, trigger: 'blur', message: 'IP不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getIp(this.curId).then(res => {
            this.ruleForm = res.data
          })
        }
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            if (!this.ruleForm.department) {
              this.ruleForm.department = null
            }
            updateIp(this.curId, this.ruleForm).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            createIp(this.ruleForm).then(res => {
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
