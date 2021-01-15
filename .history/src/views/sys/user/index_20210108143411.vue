<template>
  <div style='padding: 30px'>
    <el-alert
    title="消息提示的文案"
    type="info"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon>
  </el-alert>
    <el-form :inline='true' :model='queryParam' class='demo-form-inline'>
      <el-form-item label='搜索条件'>
        <el-input v-model='queryParam.keywords' placeholder='昵称或者账号'></el-input>
      </el-form-item>
      <el-form-item   label='角色'>
        <el-select v-model='queryParam.roleId'  placeholder='角色'>
          <el-option label='全部' value=''></el-option>
           <el-option v-for="(item, index) in roles" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='page()'>查询</el-button>
      </el-form-item>
      <el-table :data='tableData' style='width: 100%'>
        <el-table-column prop='userName' label='账号'> </el-table-column>
        <el-table-column prop='nickName' label='昵称'> </el-table-column>
        <el-table-column prop='email' label='邮箱'>
        </el-table-column>
        <el-table-column prop='roleName' label='角色'>
        </el-table-column>
        <el-table-column prop='_sex' label='性别'> </el-table-column>
        <el-table-column prop='createTime' label='创建日期'> </el-table-column>
        <el-table-column prop='_enable' label='状态'> </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope='scope'>
            <el-button
              type='text'
              size='mini'
              @click='handleEdit(scope.$index, scope.row)'
              >编辑</el-button
            >
            <el-button
              size='mini'
              type='text'
              @click='handleDelete(scope.$index, scope.row)'
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size= queryParam.pageNum
        :pager-count='11'
        layout='prev, pager, next'
        :total= total>
      </el-pagination>
    </el-form>
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
      tableData: []
    }
  },
  methods: {
    page() {
      return new Promise((resolve, reject) => {
        page(this.queryParam)
          .then((response) => {
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
            this.total = data.total
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getRoleList() {
      return new Promise((resolve, reject) => {
        roleList({})
          .then((response) => {
            const { data } = response
            this.roles = data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
  created() {
    this.page()
    this.getRoleList()
  }
}
</script>

