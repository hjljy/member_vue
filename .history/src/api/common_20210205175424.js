const common = {
  getSexName(type) {
    if (type === 1) {
      return '男'
    } else if (type === 0) {
      return '女'
    } else {
      return '保密'
    }
  },
  getStatusName(type) {
    if (type === 1) {
      return '禁用'
    } else if (type === 0) {
      return '启用'
    } else {
      return '未知'
    }
  },
  getBooleanName(type) {
    if (type === true) {
      return '是'
    } return '否 '
  },
  getUserTypeName(type) {
    if (type === 'SUPER_ADMIN') {
      return '超级管理员'
    } else if (type === 'ADMIN') {
      return '系统管理员'
    } else {
      return '普通'
    }
  },
  getOrgState(type) {
    if (type === 'USING') {
      return '使用中'
    } else if (type === 'EXPERIENCE') {
      return '体验中'
    } else if (type === 'EXPIRE') {
      return '已过期'
    } else {
      return '已禁用'
    }
  },
  getTime(fmt) {
    const time = new Date(fmt)
    const Y = time.getFullYear()
    const M = (time.getMonth() + 1).toString().padStart(2, '0')
    const D = time.getDate().toString().padStart(2, '0')
    const h = time.getHours().toString().padStart(2, '0')
    const m = time.getMinutes().toString().padStart(2, '0')
    const s = time.getSeconds().toString().padStart(2, '0')
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
}

export default common
