<template>
  <div style="padding: 30px">
    <el-alert style="padding-buttom:20px" title="提示信息" type="warning" show-icon>
      <template slot="title">
        <div>注意事项，为避免不当操作，以下操作暂不支持：</div>
        <div>1 不支持对当前登录账号的禁用，删除,以及角色，机构信息进行修改,只能修改其他的基础信息</div>
        <div>2 只能重置其他账户的密码，重置后的密码默认为：123456，本账号密码修改请点击头像进行操作</div>
        <div>3 不支持新增用户时，将账号设置为手机号码，如需关联手机号码，需用户登录，点击头像进行关联</div>
      </template>
    </el-alert>
    <div />
    <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column prop="levelName" label="等级名称" />
      <el-table-column prop="levelOrder" label="会员等级" />
      <el-table-column prop="upgradeGrowthValue" label="所需成长值" />
      <el-table-column prop="_createTime" label="创建日期" />
      <el-table-column prop="_status" label="状态" />
      <el-table-column prop="_memberDefault" label="是否默认等级" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getMemberLevelList } from '@/api/member'
import common from '@/api/common'

export default {
  name: 'Member',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getMemberLevel()
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
              i._memberDefault = common.getStatusName(i.memberDefault)
              i._status = common.getStatusName(i.status)
              i._createTime = common.getTime(i.createTime)
            })
            this.tableData = data
            resolve()
          }).catch((error) => {
            reject(error)
          })
      })
    }
  }
}
</script>
