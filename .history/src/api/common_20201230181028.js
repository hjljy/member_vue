export function getSexName(type) {
  if (type === 1) {
    return '男'
  } else if (type === 0) {
    return '女'
  } else {
    return '保密'
  }
}
export function getStatusName(type) {
  if (type === 1) {
    return '禁用'
  } else if (type === 0) {
    return '启用'
  } else {
    return '未知'
  }
}
