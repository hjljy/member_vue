<template>
  <div style='padding: 30px'>
    <el-alert
    title="消息提示的文案"
    type="info"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon>
  </el-alert>
<el-form ref="form" :rules="rules" :model="sysUser" label-width="80px">
  <el-form-item label="用户账号" prop="userName">
    <el-input v-model="sysUser.userName" ></el-input>
  </el-form-item>
  <el-form-item label="用户昵称">
    <el-input v-model="sysUser.nickName"></el-input>
  </el-form-item>
  <el-form-item label="用户密码">
    <el-input v-model="sysUser.password"></el-input>
  </el-form-item>
  <el-form-item label="用户邮箱">
    <el-input v-model="sysUser.email"></el-input>
  </el-form-item>
  <el-form-item label="所属机构">
    <el-select v-model="sysUser.orgId" placeholder="机构">
      <el-option label="默认" value="-1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="生日">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="选择日期" v-model="sysUser.birthday" style="width: 100%;"></el-date-picker>
    </el-col>
  </el-form-item>
  <el-form-item label="头像">
    <el-switch v-model="sysUser.avatarUrl"></el-switch>
  </el-form-item>
  <el-form-item label="性别">
    <el-radio-group v-model="sysUser.sex">
      <el-radio :label=1 >男</el-radio>
      <el-radio :label=0 >女</el-radio>
      <el-radio :label=-1 >保密</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="用户描述">
    <el-input type="textarea" v-model="sysUser.description"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sysUser: {
        userName: '',
        nickName: '',
        password: '',
        email: '',
        orgId: '-1',
        birthday: '',
        avatarUrl: '',
        sex: -1,
        description: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在 8到 12 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1到 8 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.sysUser)
    }
  }
}
</script>

