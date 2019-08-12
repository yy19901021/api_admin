import Http from './http'
interface LoginBody {
  username: string
  password: string
  code: string
}

 const Requests = {
  login: function(data: LoginBody) {
    return Http.post('/login',data)
  },
  logout: function() {
    return Http.get('/logout')
  },
  register(data: any) {
    return Http.post('/register', data)
  },
  getCode() {
    return Http.get('/getCode')
  },
  getUsers(search: string) {
    return Http.get('/getUsers', {search})
  },
  addProject(data: any) {
    return Http.post('/addProject', data)
  },
  updateProject(data: any) {
    return Http.post('/project/update', data)
  },
  queryProject(data: any) {
    return Http.post('/queryProject', data)
  },
  getProDetail(id: number | string) {
    return Http.post('/project/detail', {project_id: id})
  },
  delProject(id: number | string) {
    return Http.post('/project/delete', {project_id: id})
  },
  queryProjectWithModels(id: number | string) {
    return Http.post('/project/models', {project_id: id})
  },
  addModel(data: any) {
    return Http.post('/model/add', data)
  },
  updateModel(data: any) {
    return Http.post('/model/update', data)
  },
  deleteModel(id: string) {
    return Http.post('/model/delete', {model_id: id})
  },
  getModel(id: string) {
    return Http.post('/model/detail', {model_id: id})
  },
  getModelApis(data: any) {
    return Http.post('/model/apis', data)
  },
  getApiById(id: string) {
    return Http.get('/model/queryApi', {api_id: id})
  },
  eidtApi(data: any) {
    return Http.post('/model/api', data)
  },
  testApi(id: string) {
    return Http.get('/test/api/' + id)
  },
  testModelApi(id: string) {
    return Http.get('/test/model/' + id)
  },
  testMessage() {
    return Http.get('/test/message')
  },
  sendApi(data: any) {
    return Http.post('/send/api', data)
  },
  deleteApi(id: string) {
    return Http.post('/api/delete', {api_id: id})
  }
}
export default Requests
