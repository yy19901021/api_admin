import initstate from './state'
import { USER, MODELS, ADD_MODELS, LOADING, ADDLOG, REMOVELOG, LOADINGLOG, REMOVELOGALL, REMOVE_MODELS} from './actions';
import { combineReducers } from 'redux';

export function userInfor(state= initstate.userInfor, action:any) {
  switch (action.type) {
    case USER:
      return Object.assign({}, state, action.infor)
    default:
      return state
  }
}
export function models(state= initstate.models, action:any) {
  switch (action.type) {
    case MODELS:
        state = action.infor
       return state
    case ADD_MODELS:
        return state.concat(action.infor)
    case REMOVE_MODELS:
        const models = state.concat([])
        const index = models.findIndex((item: any) => item.model_id === action.model_id)
        models.splice(index, 1)
        return models
    default:
      return state
  }
}
export function isLoading(state= initstate.isLoading, action:any) {
  switch (action.type) {
    case LOADING:
      return action.loading
    default:
      return state
  }
}

export function logs(state= initstate.logs, action:any) {
  switch (action.type) {
    case ADDLOG:
       return Object.assign({}, state, {lists: state.lists.concat(action.logs)})
    case REMOVELOG:
        state.lists.splice(action.removerIndex, 1)
        return Object.assign({}, state, {lists: state.lists})
    case REMOVELOGALL:
        return Object.assign({}, state, {lists: []})        
    case LOADINGLOG:
        return Object.assign({}, state, {loading: action.loading})  
    default:
      return state
  }
}


export const rootReducer = combineReducers({userInfor, models, isLoading, logs})
