<template>
  <div style="padding: 20px">
    <el-alert title="提示信息" type="warning" show-icon>
      <template slot="title">
        <div>注意事项：</div>
        <div>1 新增会员等级时，自动按照顺序新增，无需手动设置顺序（不支持手动设置顺序）</div>
        <div>2 会员等级所需成长值即成长为该等级需要的成长值，成长值的获取方式在会员权益当中进行设置</div>
        <div>3 之前未设置会员等级，设置后，会员的成长值发生变化就会自动成为对应等级的会员</div>
      </template>
    </el-alert>
    <el-form :inline="true" class="form-inline">
      <el-form-item style="float:right">
        <el-button v-permission="['member:level:add']" style="float:right" type="primary" @click="dialogFormVisible = true">新增</el-button>
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
              v-permission="['member:level:default']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >设置为默认</el-button>
            <el-button
              v-permission="['member:level:edit']"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['member:level:del']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
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
import { getMemberLevelList, addMemberLevel, delMemberLevel } from '@/api/member/memberLevel'
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
    /** 新增会员等级 */
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
    /** 删除会员等级 */
    handleDelete(row) {
      delMemberLevel(row.levelId).then(response => {
        this.handleSuccess(true, response.msg, true)
      })
    },
    /** 重置表单 */
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.initMemberLevel()
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
