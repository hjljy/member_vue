<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="等级列表" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
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
