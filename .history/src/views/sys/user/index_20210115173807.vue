<template>
  <div style="padding: 30px">
    <el-alert title="消息提示的文案" type="info" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon />
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
          <!-- <router-link :to="{path:'/sys/user/add' }">新增</router-link> -->
        </el-button>
      </el-form-item>
      <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop="userName" label="账号" />
        <el-table-column align="center" prop="nickName" label="昵称" />
        <el-table-column align="center" prop="email" label="邮箱" />
        <el-table-column align="center" prop="createTime" label="创建日期" />
        <el-table-column align="center" prop="roleName" label="角色" />
        <el-table-column align="center" prop="_sex" width="100" label="性别" />
        <el-table-column align="center" prop="_enable" width="100" label="状态">
          <template scope="scope">
            <span style="color: #67c23a">{{ scope.row._enable }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.enable"
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >禁用</el-button>
            <el-button
              v-if="scope.row.enable"
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >启用</el-button>
            <el-button
              v-if="!scope.row.enable"
              v-permission="['sys:user:update']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-if="!scope.row.enable"
              v-permission="['sys:user:update']"
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
      <div style="padding: 20px">
        <el-alert title="消息提示的文案" type="info" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon />
        <el-form ref="sysUser" class="addForm" :rules="rules" :model="sysUser" label-width="80px">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="sysUser.userName" placeholder="请输入用户账号：长度在 8到 12 个字符" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="sysUser.nickName" placeholder="请输入用户昵称：长度在 1到 8 个字符" />
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="sysUser.password" type="password" placeholder="请输入密码：长度在 6到 12 个字符" />
          </el-form-item>
          <el-form-item label="用户邮箱">
            <el-input v-model="sysUser.email" />
          </el-form-item>
          <el-form-item label="所属机构">
            <el-select v-model="sysUser.orgId" placeholder="机构">
              <el-option label="默认" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限">
            <el-checkbox-group v-model="roles">
              <el-checkbox v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id" />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="生日">
            <el-col :span="11">
              <el-date-picker v-model="sysUser.birthday" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="sysUser.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
              <el-radio :label="-1">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户描述">
            <el-input v-model="sysUser.description" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="closeDrawer">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { page, roleList } from '@/api/user'
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
          { min: 8, max: 12, message: '长度在 8到 12 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1到 8 个字符', trigger: 'blur' }
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
  },
  methods: {
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
            console.log(data.total)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
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
    }
  }
}
</script>

