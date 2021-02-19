<template>
  <div style="padding: 30px">
    <el-alert title="提示信息" type="warning" close-text="知道了" show-icon>
      <template slot="title">
        <div> 注意事项，为避免不当操作，以下操作暂不支持</div>
        <div> 1 不支持对当前登录账号的禁用，删除操作</div>
        <div>2 不支持对当前登录账号的角色，机构信息进行修改，只能修改其他的基础信息</div>
        <div> 注意事项</div>
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
        <el-button v-permission="['sys:user:add']" type="primary" @click="dialog=true">
          新增
        </el-button>
      </el-form-item>
      <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop="userName" label="账号" />
        <el-table-column align="center" prop="nickName" label="昵称" />
        <el-table-column align="center" prop="email" label="邮箱" />
        <el-table-column align="center" prop="roleName" label="角色" />
        <el-table-column align="center" prop="createTime" width="200" label="创建日期" />
        <el-table-column align="center" prop="_sex" width="100" label="性别" />
        <el-table-column align="center" prop="_enable" width="100" label="状态">
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
              @click="handleDisable(scope.row,1)"
            >禁用</el-button>
            <el-button
              v-if="scope.row.enable && scope.row.id!=userId"
              v-permission="['sys:user:disable']"
              type="text"
              size="mini"
              @click="handleDisable(scope.row,0)"
            >启用</el-button>
            <el-button
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.id!=userId"
              v-permission="['sys:user:del']"
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
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
    <el-drawer :title="title" :visible.sync="dialog" :show-close="false" size="20%">
      <div>
        <el-form ref="addForm" class="addForm" :rules="rules" :model="sysUser" label-width="80px">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="sysUser.userName" placeholder="长度在12个字符以内" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="sysUser.nickName" placeholder="长度在8个字符以内" />
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="sysUser.password" type="password" placeholder="长度在6到18个字符" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="sysUser.email" placeholder="用户邮箱：xxx@xxx.com" />
          </el-form-item>
          <el-form-item label="所属机构">
            <el-select v-model="sysUser.orgId" placeholder="机构">
              <el-option label="默认" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限" prop="roles">
            <el-checkbox-group v-model="sysUser.roles">
              <el-checkbox v-for="(item, index) in roles" :key="index" :label="item">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="sysUser.birthday" type="date" placeholder="选择日期" style="width: 100%;" />

          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="sysUser.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
              <el-radio :label="-1">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户描述" porp="description">
            <el-input v-model="sysUser.description" type="textarea" placeholder="这个人很神秘，什么都没有留下" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
            <el-button @click="dialog=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { page, roleList, addUser, disableUser } from '@/api/user'
import { getUserId } from '@/utils/auth'
import common from '@/api/common'
export default {
  data() {
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
      title: '新增用户',
      sysUser: {
        userName: '',
        nickName: '',
        password: '',
        email: '',
        orgId: '-1',
        birthday: '',
        avatarUrl: '',
        roles: [],
        sex: -1,
        description: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
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
  },
  methods: {
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
              const names = []
              i.roles.forEach(n => {
                const { name } = n
                names.push(name)
              })
              i.roleName = names.join(',')
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
    /** 新增表单提交 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          new Promise((resolve, reject) => {
            addUser(this.sysUser).then(response => {
              this.resetForm(formName)
              this.dialog = false
              this.$notify({
                title: '成功',
                message: response.msg,
                type: 'success'
              })
              this.page()
            }).catch(error => {
              reject(error)
            })
          })
        } else {
          return false
        }
      })
    },
    /** 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /** 停用账号 */
    handleDisable(row, enable) {
      console.log(row)
      disableUser({ userId: row.id, enable: enable }).then(response => {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success'
        })
        this.page()
      })
    }
  }
}
</script>

