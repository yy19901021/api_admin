import * as React from 'react';
import {Menu, Icon} from 'antd'
import { ClickParam } from 'antd/lib/menu';
import { RouteComponentProps, withRouter } from 'react-router';
import { MyRouter } from '../../router';
import ProjectList from '../project_lists';
import ProjectEdit from '../edit_project';
import MainLayout from '../../components/layout';
export interface IMainProps {
}
export interface IMainStates {
  collapsed: boolean
}

class Main extends React.Component<IMainProps & RouteComponentProps, IMainStates> {
  type: string
  constructor(props: IMainProps & RouteComponentProps) {
    super(props)
    this.type = props.location.pathname.split('/').reverse()[0]
    this.state = {
      collapsed: false
    }
  }
  menuSelect = (params: ClickParam) => {
    this.props.history.push('/project_list/' + params.key, {type: params.key})
  }
  public render() {
    const menus = (
      <Menu onClick={this.menuSelect} defaultSelectedKeys={[this.type]} mode="inline" inlineCollapsed={this.state.collapsed} style={{width: '100%'}}>
        <Menu.Item key="mine">
          <Icon type="project" style={{fontSize: '20px'}} />
          <span>我的项目</span>
        </Menu.Item>
        <Menu.Item key="create">
          <Icon type="control" style={{fontSize: '20px'}} />
          <span>我创建的</span>
        </Menu.Item>
      </Menu>
    )
    return (
          <MainLayout silder={menus} onCollapsed = {(val) => {this.setState({collapsed: val})}}>
              <MyRouter title="项目列表" exact  path="/project_list/:type(mine|create|jion)" component={ProjectList}></MyRouter>
              <MyRouter exact  path="/project/:project_id" component={ProjectEdit}></MyRouter>
          </MainLayout>
    );
  }
}

export default withRouter<IMainProps & RouteComponentProps, any>(Main)