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
        <el-button v-permission="['member:level:add']" type="primary" @click="handleEdit(0)">
          成长值统一设置
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
    <el-dialog title="会员等级" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="memberLevel" :rules="rules" :inline="true">
        <el-form-item label="等级名称:" :label-width="formLabelWidth" prop="levelName">
          <el-input v-model="memberLevel.levelName" placeholder="请输入会员等级名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新会员默认等级:" :label-width="formLabelWidth">
          <el-select v-model="memberLevel.memberDefault" placeholder="请选择具体等级">
            <el-option label="是" value="true" />
            <el-option label="否" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="所需成长值:" :label-width="formLabelWidth" prop="upgradeGrowthValue">
          <el-input v-model="memberLevel.upgradeGrowthValue" :placeholder="ugvMessage+maxUpgradeGrowthValue" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMemberLevelList, addMemberLevel } from '@/api/member/memberLevel'
import { getOrgId } from '@/utils/auth'
import common from '@/api/common'

export default {
  name: 'Member',
  data() {
    var checkUpv = (rule, value, callback) => {
      if (this.maxUpgradeGrowthValue >= value) {
        callback(new Error('所需成长值需要大于' + this.maxUpgradeGrowthValue))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      memberLevel: '',
      maxLevelOrder: 0,
      maxUpgradeGrowthValue: 0,
      ugvMessage: '成长值需要大于',
      tableData: [],
      rules: {
        levelName: [
          { required: true, message: '请输入会员等级名称', trigger: 'blur' },
          { max: 12, message: '长度在12 个字符以内', trigger: 'blur' }
        ],
        upgradeGrowthValue: [
          { required: true, message: '请输入等级所需成长值', trigger: 'blur' },
          { validator: checkUpv, trigger: 'blur' },
          { max: 8, message: '长度在8 个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMemberLevelList()
    this.initMemberLevel()
  },
  methods: {
    /** 初始化会员信息 */
    initMemberLevel() {
      this.memberLevel = {
        levelName: '',
        orgId: getOrgId(),
        upgradeGrowthValue: '',
        memberDefault: 'false'
      }
    },
    /** 获取会员等级列表 */
    getMemberLevelList() {
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
              if (this.maxLevelOrder < i.levelOrder) {
                this.maxLevelOrder = i.levelOrder
              }
              if (this.maxUpgradeGrowthValue < i.upgradeGrowthValue) {
                this.maxUpgradeGrowthValue = i.upgradeGrowthValue
              }
            })
            this.tableData = data
            resolve()
          }).catch((error) => {
            reject(error)
          })
      })
    },
    handleAdd(formName) {
      this.memberLevel.levelOrder = this.maxLevelOrder + 1
      if (this.memberLevel.upgradeGrowthValue < this.maxLevelOrder) {
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addMemberLevel(this.memberLevel).then(response => {
            this.resetForm(formName)
            this.dialogFormVisible = false
            this.handleSuccess(true, response.msg, true)
          })
        } else {
          return false
        }
      })
    },
    /** 操作成功处理 */
    handleSuccess(notify, msg, page) {
      if (notify) {
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        })
      }
      if (page) {
        this.getMemberLevelList()
      }
    }
  }
}
</script>
