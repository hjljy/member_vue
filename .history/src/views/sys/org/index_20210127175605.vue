<template>
  <div style="padding: 30px">
    <el-alert title="提示信息" type="warning" show-icon>
      <template slot="title">
        <div>注意事项：</div>
        <div>1 只能修改机构的基础信息</div>
        <div>2 机构管理员默认拥有机构所有权限，一个机构只能有一个管理员账号</div>
      </template>
    </el-alert>
    <el-form :inline="true" :model="queryParam" class="form-inline">
      <el-form-item label="搜索条件" style="width:400px">
        <el-input v-model="queryParam.keywords" placeholder="机构名称或者机构管理员名称" style="width:300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page()">查询</el-button>
        <el-button
          v-permission="['sys:org:add']"
          type="primary"

          @click="dialog=true"
        >新增</el-button>
      </el-form-item>
      <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop="logo" label="机构logo" />
        <el-table-column align="center" prop="name" label="机构名称" />
        <el-table-column align="center" prop="adminNickName" label="管理员名称" />
        <el-table-column align="center" prop="adminPhone" label="管理员手机号码" />
        <el-table-column align="center" prop="createTime" width="190" label="创建日期" />
        <el-table-column align="center" prop="_orgState" width="80" label="状态">
          <template scope="scope">
            <span v-if="scope.row._orgState!=='已禁用'" style="color: #67c23a">{{ scope.row._orgState }}</span>
            <span v-else style="color: red">{{ scope.row._orgState }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="260" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row._orgState!=='已禁用'"
              v-permission="['sys:org:disable']"
              type="text"
              size="mini"
              @click="handleEdit(0,1)"
            >禁用</el-button>
            <el-button
              v-if="scope.row._orgState==='已禁用'"
              v-permission="['sys:org:disable']"
              type="text"
              size="mini"
              @click="handleDisable(scope.row.id,0)"
            >启用</el-button>
            <el-button
              v-permission="['sys:org:edit']"
              type="text"
              size="mini"
              @click="handleEdit(1,scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['sys:org:bind']"
              type="text"
              size="mini"
              @click="handlerpd(scope.row.id)"
            >绑定</el-button>
            <el-button
              v-permission="['sys:org:list']"
              type="text"
              size="mini"
              @click="handleEdit(2,scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.id!=userId"
              v-permission="['sys:org:del']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-drawer :title="title" :visible.sync="dialog" :show-close="false" size="20%" @close="handleClose('addForm')">
      <div>
        <el-form ref="addForm" class="addForm" :rules="rules" :model="sysOrg" label-width="80px">
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="sysOrg.name" placeholder="长度在12个字符内" />
          </el-form-item>
          <el-form-item label="所属机构" prop="orgId">
            <el-select v-model="sysOrg.pid" placeholder="机构" :disabled="noSelfChange">
              <el-option v-for="(item, id) in orgList" :key="id" :label="item.id" :value="item">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构描述" prop="description">
            <el-input v-model="sysOrg.description" type="textarea" :disabled="noShow" placeholder="很神秘，什么都没有留下" />
          </el-form-item>
          <el-form-item v-show="!noShow">
            <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
            <el-button @click="dialog=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { roleList, addUser, disableUser, delUser, updateUser, resetPassword } from '@/api/user'
import { list } from '@/api/org'
import { getUserId } from '@/utils/auth'
import common from '@/api/common'
export default {
  data() {
    return {
      queryParam: {
        keywords: ''
      },
      userId: '',
      roles: [],
      tableData: [],
      dialog: false,
      noChange: false,
      noSelfChange: false,
      noShow: false,
      itemShow: true,
      title: '新增机构',
      sysOrg: {},
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 12, message: '长度在12 个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.page()
    this.getRoleList()
    this.userId = getUserId()
    this.resetUser()
  },
  methods: {
    /** 初始化sysOrg对象 */
    resetUser() {
      this.sysOrg = {
        id: '',
        name: '',
        adminNickName: '',
        password: '',
        email: '',
        orgId: '-1',
        birthday: new Date(),
        avatarUrl: '',
        roles: [],
        roleIds: [],
        sex: -1,
        description: ''
      }
    },
    /** 分页查询 */
    page() {
      return new Promise((resolve, reject) => {
        list(this.queryParam)
          .then(response => {
            const { data } = response
            this.tableData = data
            this.tableData.forEach(i => {
              i.createTime = common.getTime(i.createTime)
              i._orgState = common.getOrgState(i.orgState)
            })

            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /** 获取角色信息 */
    getRoleList() {
      return new Promise((resolve, reject) => {
        roleList({})
          .then(response => {
            const { data } = response
            this.roles = data
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /** 新增编辑表单提交 */
    submitForm(formName) {
      /** 新增 */
      if (!this.sysUser.id) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sysUser.roles = []
            addUser(this.sysUser).then(response => {
              this.resetForm(formName)
              this.dialog = false
              this.handleSuccess(true, response.msg, true)
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs[formName].validateField(['userName', 'nickName', 'email'], msg => {
          if (msg) {
            console.warn(msg)
            return false
          }
        })
        /** 编辑 */
        updateUser(this.sysUser).then(response => {
          this.sysUser.roles = []
          this.resetForm(formName)
          this.dialog = false
          this.handleSuccess(true, response.msg, true)
        })
      }
    },
    /** 重置表单 */
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.resetUser()
    },
    /** 停用账号 */
    handleDisable(id, enable) {
      disableUser({ userId: id, enable: enable }).then(response => {
        this.handleSuccess(true, response.msg, true)
      })
    },
    /** 重置密码 */
    handlerpd(id) {
      resetPassword({ userId: id }).then(response => {
        this.handleSuccess(true, response.msg, true)
      })
    },
    /** 关闭表单处理 */
    handleClose(formName) {
      this.noShow = false
      this.resetForm(formName)
    },
    /** 删除账号 */
    handleDelete(id) {
      delUser({ userId: id }).then(response => {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success'
        })
        this.page()
      })
    },
    /** 弹出新增/或编辑账号框 */
    handleEdit(type, row) {
      if (type === 0) {
        this.dialog = true
        this.noSelfChange = false
        this.noChange = false
        this.itemShow = true
        this.title = '新增用户'
      } else if (type === 1) {
        this.noSelfChange = false
        if (row.id === this.userId) {
          this.noSelfChange = true
        }
        this.dialog = true
        this.noChange = true
        this.itemShow = false
        this.title = '编辑用户'
        this.sysUser = JSON.parse(JSON.stringify(row))
        this.sysUser.roleIds = Array.from(new Set(row.roles.map(item => item.id)))
      } else if (type === 2) {
        console.log(row)
        this.itemShow = false
        this.dialog = true
        this.noSelfChange = true
        this.title = '用户详情'
        this.sysUser = JSON.parse(JSON.stringify(row))
        this.sysUser.roleIds = Array.from(new Set(row.roles.map(item => item.id)))
        this.noShow = true
        console.log(this.sysUser)
      }
    },
    /** 操作成功处理 */
    handleSuccess(notify, msg, page) {
      if (notify) {
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        })
      }
      if (page) {
        this.page()
      }
    }
  }
}
</script>

