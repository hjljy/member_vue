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
