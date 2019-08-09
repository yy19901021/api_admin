import { Route, RouteProps, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { rootReducer } from "../redux/reducers";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import * as React from 'react';
import Login from "../views/login";
import Main from "../views/main";
import Project_detail from "../views/project_detail";

export const store = createStore(rootReducer)



const SimpleRouter = (props: RouteProps &{title?: string, userInfor?: any}) => {
  if (props.title) {
    document.title = props.title
  }
  if (!props.userInfor.id && props.path !== '/login') {
    return <Redirect to="/login"></Redirect>
  } else if(props.userInfor.id && props.path === '/login') {
    return <Redirect to="/"></Redirect>
  } else {
    return <Route {...props}></Route>
  }
}
export const MyRouter = connect((state: any) => {
  return {
    userInfor: state.userInfor
  }
})(SimpleRouter)


export default () => (
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <MyRouter exact path="/login" component={Login}  title="登录"></MyRouter>
        <MyRouter  path="/projectDetail/:project_id" component={Project_detail}></MyRouter>
        <Redirect exact from="/" to="/project_list/mine"></Redirect>
        <MyRouter  path="/" component={Main}></MyRouter>
      </Switch>
    </Provider>
  </BrowserRouter>
)