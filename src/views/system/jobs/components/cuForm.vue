<template>
  <el-dialog :visible.sync="dialogVisible" title="新增调度任务" width="700px" :before-close="close">
    <el-form ref="ruleForm" label-position="left" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="函数名称" prop="name">
        <el-select
          v-model="ruleForm.name"
          clearable
          filterable
          remote
          placeholder="请输入调度函数名称或功能描述"
          :remote-method="getJobFunction"
          :loading="loading"
        >
          <el-option
            v-for="item in functionOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <el-tooltip placement="right">
              <div slot="content">{{ item.desc }}</div>
              <span style="float:left">{{ item.name }}</span>
            </el-tooltip>
          </el-option>
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
import { getJobFunctions, createJob } from '@/api/system/jobs'
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
        name: '',
        cron: ''
      },
      functionOptions: {},
      loading: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: '函数名不能为空' }],
        cron: [{ required: true, trigger: 'blur', message: 'Cron表达式不能为空' }]
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
    // 获取调度函数列表
    getJobFunction(query) {
      if (query !== '') {
        this.loading = true
        getJobFunctions({ 'search': query }).then(res => {
          this.functionOptions = res.data.results
          this.loading = false
        })
      } else {
        this.functionOptions = []
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createJob(this.ruleForm).then(res => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.search()
          })
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
