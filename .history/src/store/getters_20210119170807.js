const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userName,
  nickName: state => state.user.nickName,
  userId: state => state.user.userId,
  orgId: state => state.user.orgId,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
