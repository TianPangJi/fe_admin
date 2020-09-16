<template>
  <el-dialog :visible.sync="dialogVisible" :title="curId ? '编辑页面' : '新增页面'" width="700" :before-close="close">
    <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" type="username" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getUser } from '@/api/system/users'
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
        username: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v && this.curId) {
        // 编辑
        // this.$nextTick(() => {
        //   getUser(this.curId).then(res => {
        //     this.ruleForm = res.data
        //   })
        // })
        getUser(this.curId).then(res => {
          this.ruleForm = res.data
        })
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    }
  }
}
</script>
