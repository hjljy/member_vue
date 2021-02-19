<template>
  <div style="padding: 20px">
    <el-alert title="提示信息" type="warning" show-icon>
      <template slot="title">
        <div>注意事项，为避免不当操作，以下操作暂不支持：</div>
        <div>1 不支持对当前登录账号的禁用，删除,以及角色，机构信息进行修改,只能修改其他的基础信息</div>
        <div>2 只能重置其他账户的密码，重置后的密码默认为：123456，本账号密码修改请点击头像进行操作</div>
        <div>3 不支持新增用户时，将账号设置为手机号码，如需关联手机号码，需用户登录，点击头像进行关联</div>
      </template>
    </el-alert>
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-button v-permission="['member:level:add']" type="primary" @click="dialogFormVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['sys:user:add']" type="primary" @click="handleEdit(0)">
          成长值设置
        </el-button>
      </el-form-item>
      <el-table :border="true" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column align="center" prop="levelOrder" label="会员等级" />
        <el-table-column align="center" prop="levelName" label="等级名称" />
        <el-table-column align="center" prop="upgradeGrowthValue" label="所需成长值" />
        <el-table-column align="center" prop="_createTime" label="创建日期" />
        <el-table-column align="center" prop="_memberDefault" label="新会员默认等级" />
        <el-table-column align="center" label="操作">
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
    </el-form>
    <!-- Form -->
    <!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button> -->

    <el-dialog title="会员等级" :visible.sync="dialogFormVisible">
      <el-form :model="memberLevel" inline="true">
        <el-form-item label="等级名称:" :label-width="formLabelWidth">
          <el-input v-model="memberLevel.levelName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="具体等级:" :label-width="formLabelWidth">
          <el-select v-model="memberLevel.levelOrder" placeholder="请选择具体等级">
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
            <el-option label="3" value="3" />
            <el-option label="4" value="4" />
            <el-option label="5" value="5" />
            <el-option label="6" value="6" />
            <el-option label="7" value="7" />
            <el-option label="8" value="8" />
            <el-option label="9" value="9" />
            <el-option label="10" value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="所需成长值:" :label-width="formLabelWidth">
          <el-input v-model="memberLevel.upgradeGrowthValue" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否新会员默认等级:" :label-width="formLabelWidth">
          <el-select v-model="memberLevel.memberDefault" placeholder="请选择具体等级">
            <el-option label="否" value="false" />
            <el-option label="是" value="true" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMemberLevelList } from '@/api/member/memberLevel'
import { getOrgId } from '@/utils/auth'
import common from '@/api/common'

export default {
  name: 'Member',
  data() {
    return {
      formLabelWidth: '120px',
      memberLevel: '',
      dialogFormVisible: false,
      tableData: []
    }
  },
  created() {
    this.getMemberLevel()
    this.initMemberLevel()
  },
  methods: {
    /** */
    initMemberLevel() {
      this.memberLevel = {
        levelName: '',
        levelOrder: 0,
        orgId: getOrgId(),
        upgradeGrowthValue: 0,
        memberDefault: false
      }
    },
    /** 获取会员等级列表 */
    getMemberLevel() {
      const param = {
        orgId: getOrgId()
      }
      return new Promise((resolve, reject) => {
        getMemberLevelList(param)
          .then((response) => {
            const { data } = response
            data.forEach(i => {
              i._memberDefault = common.getBooleanName(i.memberDefault)
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
