let userInfor = {}

if (sessionStorage.getItem('userInfor')) {
  userInfor = JSON.parse((sessionStorage.getItem('userInfor') as string))
}

export default {
  userInfor: userInfor,
  models: [],
  isLoading: false,
  logs: {
    lists: [],
    loading: false
  }
}