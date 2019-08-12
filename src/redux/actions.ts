export const USER = 'USER'
export const MODELS = 'models'
export const ADD_MODELS = 'add_models'
export const REMOVE_MODELS = 'remove_models'
export const LOADING = 'loading'
export const ADDLOG = 'addlog'
export const REMOVELOG = 'removelog'
export const LOADINGLOG = 'loadinglog'
export const REMOVELOGALL = 'removelogall'
export function getUser(infor?: any) {
  return {
    type: USER,
    infor
  }
}

export function getModels(infor?: any[]) {
  return {
    type: MODELS,
    infor
  }
}
export function addModels(infor: any) {
  return {
    type: ADD_MODELS,
    infor
  }
}
export function removeModels(id: string) {
  return {
    type: REMOVE_MODELS,
    model_id: id
  }
}

export function loading(isloading: boolean) {
  return {
    type: LOADING,
    loading: isloading
  }
}

export function addLogs(log: any) {
  return {
    type: ADDLOG,
    logs: log
  }
}
export function removeLog(index: number, type?: string) {
  return {
    type: type || REMOVELOG,
    removerIndex: index
  }
}
export function loadingLog(loading: boolean) {
  return {
    type: LOADINGLOG,
    loading: loading
  }
}

