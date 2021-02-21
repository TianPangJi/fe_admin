<template>
  <el-dialog :visible.sync="permissionsDialogVisible" title="权限列表" width="700px" :before-close="close">
    <el-tree
      ref="permissions"
      :data="permissionsData"
      :default-checked-keys="permissionsIds"
      :props="defaultProps"
      check-strictly
      accordion
      show-checkbox
      node-key="id"
    />
  </el-dialog>
</template>
<script>
import { getPermissions } from '@/api/system/permissions'
import { getUserPermissions } from '@/api/system/users'
export default {
  name: 'PermissionsDialog',
  props: {
    permissionsDialogVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      permissionsData: [],
      permissionsIds: [],
      defaultProps: { children: 'children', label: 'label' }
    }
  },
  watch: {
    permissionsDialogVisible(v) {
      if (v) {
        if (this.userId) {
          getPermissions().then(res => {
            this.permissionsData = res.data.results
            this.changeDisabled(this.permissionsData, true)
          })
          getUserPermissions(this.userId).then(res => {
            this.permissionsIds = res.data.results
          })
        }
      }
    }
  },
  methods: {
    close() {
      this.permissionsIds = []
      this.permissionsData = []
      this.$emit('permissionsClose')
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
