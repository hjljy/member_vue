<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="等级列表" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="createTime" label="创建日期" width="180"> </el-table-column>
      <el-table-column prop="levelName" label="会员名称" width="180"> </el-table-column>
      <el-table-column prop="levelOrder" label="会员等级" width="180"> </el-table-column>
      <el-table-column prop="upgradeGrowthValue" label="所需成长值" width="180"> </el-table-column>
      <el-table-column prop="memberDefault" label="新会员默认等级" width="180"> </el-table-column>
      <el-table-column  label="操作" > </el-table-column>
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
