<template>
  <div style='padding: 30px'>
    <el-alert :closable='false' title='用户列表'></el-alert>
    <el-form :inline='true' class='demo-form-inline'>
      <el-form-item label='审批人'>
        <el-input placeholder='审批人'></el-input>
      </el-form-item>
      <el-form-item label='活动区域'>
        <el-select placeholder='活动区域'>
          <el-option label='区域一' value='shanghai'></el-option>
          <el-option label='区域二' value='beijing'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onSubmit'>查询</el-button>
      </el-form-item>
      <el-table :data='tableData' style='width: 100%'>
        <el-table-column prop='levelName' label='账号'> </el-table-column>
        <el-table-column prop='levelOrder' label='昵称'> </el-table-column>
        <el-table-column prop='upgradeGrowthValue' label='邮箱'>
        </el-table-column>
        <el-table-column prop='upgradeGrowthValue' label='部门'>
        </el-table-column>
        <el-table-column prop='upgradeGrowthValue' label='角色'>
        </el-table-column>
        <el-table-column prop='sex' label='性别'> </el-table-column>
        <el-table-column prop='createTime' label='创建日期'> </el-table-column>
        <el-table-column prop='enable' label='状态'> </el-table-column>
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
  :page-size='20'
  :pager-count='11'
  layout='prev, pager, next'
  :total='1000'>
</el-pagination>
    </el-form>
  </div>
</template>
<script>
import { page } from '@/api/user'
export default {
  data() {
    return {
      queryParam: {
        orgId: '-1',
        keywords: '',
        pageNo: 1,
        pageNum: 10
      },
      tableData: []
    }
  },
  methods: {
    page() {
      return new Promise((resolve, reject) => {
        page(this.queryParam)
          .then((response) => {
            const { data } = response
            this.tableData = data
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
  }
}
</script>

