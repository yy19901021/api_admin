import * as React from 'react';
import './index.scss';
import {Menu, Icon, Avatar, Dropdown} from 'antd'
import { ClickParam } from 'antd/lib/menu';
import { RouteComponentProps, withRouter, Switch } from 'react-router';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions';
import Requests from '../../api';
export interface ILayoutProps {
  name: string
  clearUser: any
  silder: React.ReactElement,
  hideColCollapsed?: boolean
  onCollapsed: (val: boolean) => void
}
export interface ILayoutStates {
  collapsed: boolean
  type: string
}

class Layout extends React.Component<ILayoutProps & RouteComponentProps, ILayoutStates> {
  readonly state: ILayoutStates
  constructor(props: ILayoutProps & RouteComponentProps) {
    super(props)
    this.state = {
      collapsed: false,
      type: props.location.pathname.split('/').reverse()[0]
    }
  }
  toggle = (e: React.MouseEvent) => {
    this.setState((state) => {
      this.props.onCollapsed(!state.collapsed)
      return {collapsed: !state.collapsed}
    })
  }
  userMenu = (params: ClickParam) => {
    switch (params.key) {
      case 'logout':
          Requests.logout().then(() => {
            sessionStorage.removeItem('userInfor');
            this.props.clearUser()
            this.props.history.push('/login');
          })
        break;
      default:
        break;
    }
  }
  public render() {
    const menus = (
      <Menu onClick={this.userMenu}>
        <Menu.Item key="logout">
           退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="layout">
        <div className="layout-sider" style={{width: this.state.collapsed ? '80px' : '200px'}}>
          <div className="logo_api"></div>
            {this.props.silder}
        </div>
        <div className="layout-right">
          <div className="layout-right-header">
            <div className="flex-1"> {!this.props.hideColCollapsed && <Icon type={this.state.collapsed ? 'menu-fold' : 'menu-unfold'} style={{fontSize: '30px'}} onClick={this.toggle}/>}</div>
            <div className="flex-c">
              <Avatar size={40} icon="user"></Avatar>
              <Dropdown overlay={menus}>
               <span style={{paddingLeft: 20, paddingRight:20}}>{this.props.name} <Icon type="down" /></span>
              </Dropdown>
            </div>
          </div>
          <div className="layout-right-content-container">
            <div className="layout-right-content">
              <div className="layout-right-content-inner">
                <Switch>
                  {this.props.children}
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state:any) => {
  return {
    name: state.userInfor.pet_name
  }
}, (dispatch) => {
  return {
    clearUser: () => {dispatch(getUser({}))}
  }
})(withRouter<ILayoutProps & RouteComponentProps, any>(Layout))