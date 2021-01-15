<template>
  <div style="padding: 30px">
    <el-alert :closable="false" >会员列表 <el-button 
          style="float: right"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">新增</el-button></el-alert>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="levelName" label="会员名称" > </el-table-column>
      <el-table-column prop="levelOrder" label="会员等级" > </el-table-column>
      <el-table-column prop="upgradeGrowthValue" label="所需成长值"> </el-table-column>
      <el-table-column prop="createTime" label="创建日期"> </el-table-column>
      <el-table-column prop="status" label="状态" > </el-table-column>
      <el-table-column prop="_memberDefault" label="会员默认等级" > </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button 
          type="text"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="text"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getMemberLevelList } from '@/api/member'

export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    getMemberLevel() {
      const param = {
        orgId: '-1'
      }
      return new Promise((resolve, reject) => {
        getMemberLevelList(param)
          .then((response) => {
            const { data } = response
            data.forEach(i => {
              i._memberDefault = i.memberDefault ? '开启' : '关闭'
            })
            this.tableData = data
            resolve()
          }).catch((error) => {
            reject(error)
          })
      })
    }
  },
  created() {
    this.getMemberLevel()
  }
}
</script>
