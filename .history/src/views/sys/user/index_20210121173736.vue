<template>
  <div style="padding: 30px">
    <el-alert title="提示信息" type="warning" show-icon>
      <template slot="title">
        <div>注意事项，为避免不当操作，以下操作暂不支持：</div>
        <div>1 不支持对当前登录账号的禁用，删除,以及角色，机构信息进行修改,只能修改其他的基础信息</div>
        <div>2 只能重置其他账户的密码，重置后的密码默认为：123456，本账号密码修改请点击头像进行操作</div>
        <div>3 不支持新增用户时，将账号设置为手机号码，如需关联手机号码，需用户登录，点击头像进行关联</div>
      </template>
    </el-alert>
    <el-form :inline="true" :model="queryParam" class="form-inline">
      <el-form-item label="搜索条件">
        <el-input v-model="queryParam.keywords" placeholder="昵称或者账号" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="queryParam.roleId" placeholder="角色">
          <el-option label="全部" value />
          <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['sys:user:add']" type="primary" @click="handleEdit(0)">
          新增
        </el-button>
      </el-form-item>
      <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop="userName" label="账号" />
        <el-table-column align="center" prop="_userType" width="120" label="账号类型" />
        <el-table-column align="center" prop="nickName" label="昵称" />
        <el-table-column align="center" prop="phone" label="手机号码" />
        <el-table-column align="center" prop="email" label="邮箱" />
        <el-table-column align="center" prop="roleName" label="角色" />
        <el-table-column align="center" prop="createTime" width="190" label="创建日期" />
        <el-table-column align="center" prop="_sex" width="80" label="性别" />
        <el-table-column align="center" prop="_enable" width="80" label="状态">
          <template scope="scope">
            <span v-if="!scope.row.enable" style="color: #67c23a">{{ scope.row._enable }}</span>
            <span v-else style="color: red">{{ scope.row._enable }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.enable && scope.row.id!=userId"
              v-permission="['sys:user:disable']"
              type="text"
              size="mini"
              @click="handleDisable(scope.row.id,1)"
            >禁用</el-button>
            <el-button
              v-if="scope.row.enable && scope.row.id!=userId"
              v-permission="['sys:user:disable']"
              type="text"
              size="mini"
              @click="handleDisable(scope.row.id,0)"
            >启用</el-button>
            <el-button
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(1,scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.id!=userId"
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(1,scope.row)"
            >重置密码</el-button>
            <el-button
              v-permission="['sys:user:list']"
              type="text"
              size="mini"
              @click="handleEdit(2,scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.id!=userId"
              v-permission="['sys:user:del']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="queryParam.pageNum"
        layout="total, prev, pager, next"
        :total="total"
        :hide-on-single-page="true"
        @current-change="page"
      />
    </el-form>
    <el-drawer :title="title" :visible.sync="dialog" :show-close="false" size="20%" @close="handleClose('addForm')">
      <div>
        <el-form ref="addForm" class="addForm" :rules="rules" :model="sysUser" label-width="80px">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="sysUser.userName" placeholder="长度在12个字符内,不能是电话号码" :disabled="noChange||noShow" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="sysUser.nickName" placeholder="长度在8个字符以内" :disabled="noShow" />
          </el-form-item>
          <el-form-item v-show="itemShow" label="用户密码" prop="password">
            <el-input v-model="sysUser.password" type="password" placeholder="长度在6到18个字符" :disabled="noShow" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="sysUser.email" placeholder="用户邮箱：xxx@xxx.com" :disabled="noShow" />
          </el-form-item>
          <el-form-item label="所属机构" prop="orgId">
            <el-select v-model="sysUser.orgId" placeholder="机构" :disabled="noSelfChange">
              <el-option label="默认" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限" prop="roleIds">
            <el-checkbox-group v-model="sysUser.roleIds" :disabled="noSelfChange">
              <el-checkbox v-for="(item, id) in roles" :key="id" :label="item.id" :value="item">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="sysUser.birthday" type="date" placeholder="选择日期" style="width: 100%;" :disabled="noShow" />

          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="sysUser.sex" :disabled="noShow">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
              <el-radio :label="-1">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户描述" prop="description">
            <el-input v-model="sysUser.description" type="textarea" :disabled="noShow" placeholder="这个人很神秘，什么都没有留下" />
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
import { page, roleList, addUser, disableUser, delUser, updateUser } from '@/api/user'
import { getUserId } from '@/utils/auth'
import common from '@/api/common'
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if ((/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('账号暂不支持手机号码'))
      } else {
        callback()
      }
    }
    return {
      queryParam: {
        roleId: '',
        orgId: '-1',
        keywords: '',
        pageNo: 1,
        pageNum: 20
      },
      userId: '',
      roles: [],
      total: 10,
      tableData: [],
      dialog: false,
      noChange: false,
      noSelfChange: false,
      noShow: false,
      itemShow: true,
      title: '新增用户',
      sysUser: {},
      rules: {
        userName: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' },
          { max: 12, message: '长度在12 个字符以内', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { max: 8, message: '长度在8 个字符以内', trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: false, message: '请输入正确格式的用户邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6到 12 个字符', trigger: 'blur' }
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
    /** 初始化sysUser对象 */
    resetUser() {
      this.sysUser = {
        id: '',
        userName: '',
        nickName: '',
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
        page(this.queryParam)
          .then(response => {
            const { data } = response
            this.tableData = data.records
            this.tableData.forEach(i => {
              i._sex = common.getSexName(i.sex)
              i._enable = common.getStatusName(i.enable)
              i.createTime = common.getTime(i.createTime)
              i.birthday = common.getTime(i.birthday)
              i._userType = common.getUserTypeName(i.userType)
              const names = []
              i.roles.forEach(n => {
                const { name } = n
                names.push(name)
              })
              i.roleName = names.join(',')
              if (i.roleName === '') {
                i.roleName = '无'
              }
            })
            this.total = Number(data.total)
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
            console.log(msg)
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
        if (row.id === this.userId) {
          this.noSelfChange = true
        }
        this.dialog = true
        this.noChange = true
        this.itemShow = false
        this.title = '编辑用户'
        this.sysUser = JSON.parse(JSON.stringify(row))
        this.sysUser.roleIds = Array.from(new Set(row.roles.map(item => item.id)))
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate('password')
        })
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

