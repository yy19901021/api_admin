import * as React from 'react';
import './index.scss';
import {Card} from 'antd'
import { RouteComponentProps } from 'react-router';
import Login from './login';
import Register from './register';

export interface ILoginProps extends RouteComponentProps {
  
}
export interface ILoginStates {
  noTitleKey: string
}
const tabList = [
  {key: 'login', tab: '登录'},
  {key: 'register', tab: '注册'},
]

const tabListNode: Map<string, JSX.Element> = new Map()
tabListNode.set('login', <Login></Login>)
tabListNode.set('register', <Register></Register>)
 class LoginAndRes extends React.Component<ILoginProps, ILoginStates> {
   readonly state: ILoginStates
   constructor(props:ILoginProps) {
      super(props)
      this.state = {
        noTitleKey: 'login'
      }
   }
   TabChange = (key: string) => {
     this.setState({
      noTitleKey: key
     })
   }
  public render() {
    return (
      <div className="login flex-center">
        <div >
          <h1 className="login-title">API_manager</h1>
          <Card  tabList={tabList} activeTabKey={this.state.noTitleKey} onTabChange={this.TabChange} style={{width: 400}}>
             {tabListNode.get(this.state.noTitleKey)}
          </Card>
        </div>
      </div>
    );
  }
}

export default LoginAndRes