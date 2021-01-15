<template>
  <div style='padding: 30px'>
    <el-alert
    title="消息提示的文案"
    type="info"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon>
  </el-alert>
    <el-form :inline='true' :model='queryParam' class='form-inline'>
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
      <el-form-item>
        <el-button type='primary' @click='handleEditAdd()'>新增</el-button>
      </el-form-item>
      <el-table :border="true" :data='tableData' :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop='userName' label='账号'> </el-table-column>
        <el-table-column align="center" prop='nickName' label='昵称'> </el-table-column>
        <el-table-column align="center" prop='email' label='邮箱'>
        </el-table-column>
        <el-table-column align="center" prop='createTime' label='创建日期'> </el-table-column>
        <el-table-column align="center" prop='roleName' label='角色'>
        </el-table-column>
        <el-table-column align="center" prop='_sex' width="100" label='性别'> </el-table-column>
        <el-table-column align="center" prop='_enable' width="100" label='状态'>
            <template scope="scope">
        <span  style="color: #67c23a">{{scope.row._enable}}</span>
    </template> </el-table-column>
        <el-table-column align="center" label='操作'>
          <template slot-scope='scope'>
            <el-button
              type='text'
              size='mini'
              @click='handleEdit(scope.$index, scope.row)'
              ><span v-if="!scope.row.enable" style="color: #67c23a">禁用</span></el-button
            >
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
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size= queryParam.pageNum
      layout="total, prev, pager, next"
      :total=total
      :hide-on-single-page=true>
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
            this.total = Number(data.total)
            console.log(data.total)
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

