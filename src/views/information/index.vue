<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="avatar" title="点击上传头像" class="avatar" @click="toggleShow">
                <myUpload
                  v-model="show"
                  :headers="headers"
                  :url="updateAvatarApi"
                  method="PUT"
                  field="image"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户姓名 <div class="user-right">{{ name }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ department }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ mobile }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ email }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialogVisible = true">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" style="margin-left: 20px;">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" style="width: 40%" />
                <span style="color: #C0C0C0;margin-left: 10px;">用户真实姓名或昵称</span>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" style="width: 40%" />
                <span style="color: #C0C0C0;margin-left: 10px;">手机号可用于登录使用</span>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" style="width: 40%" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存配置</el-button>
              </el-form-item>
            </el-form></div>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass" />
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import updatePass from './components/updatePass'
import { validatePhone, validateEMail } from '@/utils/rulesValidate'
import { changeInformation } from '@/api/information/centre'
import { mapGetters } from 'vuex'
import store from '@/store'
import { getToken } from '@/utils/auth'
export default {
  name: 'Centre',
  components: { updatePass, myUpload },
  data() {
    return {
      show: false,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      form: {},
      rules: {
        name: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: validateEMail, trigger: 'blur' }
        ],
        mobile: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      updateAvatarApi: process.env.VUE_APP_BASE_API + '/information/change-avatar/'
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'department',
      'name',
      'avatar',
      'mobile',
      'email'
    ])
  },
  created() {
    this.form = { name: this.name, mobile: this.mobile, email: this.email }
    store.dispatch('user/getInfo').then(() => {})
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    // 头像上传成功的回调
    cropUploadSuccess() {
      store.dispatch('user/getInfo').then(() => {})
    },
    // 修改个人信息
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   if (this.form.mobile === '') {
        //     this.form.mobile = null
        //   }
          changeInformation(this.form).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            store.dispatch('user/getInfo').then(() => {})
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
