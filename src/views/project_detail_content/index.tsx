import * as React from 'react';
import './index.scss'
import { RouteComponentProps } from 'react-router';
import Requests from '../../api';
import Moment from 'moment'
import {Button, Descriptions} from 'antd'
import { Link } from 'react-router-dom';
import ModelEdit from '../../components/model_edit';
export interface IDetailContentProps extends RouteComponentProps<{project_id: string}> {
  
}
export interface IDetailContentStates  {
  detail: any
  visible_model: boolean
}
export default class DetailContent extends React.Component<IDetailContentProps, IDetailContentStates> {
  project_id:  string
  constructor(props: IDetailContentProps) {
    super(props)
    this.state = {
      detail: {},
      visible_model: false
    }
    this.project_id = props.match.params.project_id
  }
  getDetail() {
    Requests.getProDetail(this.project_id).then((data) => {
      if (data.code === 200) {
        this.setState({
          detail: data.data
        })
      }
    })
  }
  componentDidMount() {
    this.getDetail()
  }
  showModel = ()=> {
    this.setState({
      visible_model: true
    })
  }
  public render() {
    return (
      <div className="detail-content">
        <Descriptions bordered title={this.state.detail.title}>
          <Descriptions.Item label="项目">{this.state.detail.title}</Descriptions.Item>
          <Descriptions.Item label="项目创建人" span={1}>{`${this.state.detail.created_pet_name}(${this.state.detail.created_username})`}</Descriptions.Item>
          <Descriptions.Item label="项目创建时间" span={1}>{Moment(new Date(this.state.detail.create_time)).format('YYYY-MM-DD hh:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="项目成员" span={3}>{this.state.detail.members && this.state.detail.members.map((item: any) => `${item.pet_name}(${item.username})`).join(',')}</Descriptions.Item>
          <Descriptions.Item label="项目描述" span={3}>{this.state.detail.description}</Descriptions.Item>
        </Descriptions>
        <div className="flex-c" style={{paddingTop: 20, justifyContent: 'flex-end'}}>
          <div className="flex-1">
            <Button type="primary">项目API接口测试</Button>
            <Button type="primary" style={{marginLeft: 20}} onClick={this.showModel}>添加项目模块</Button>
          </div>
          <Button type="link" style={{marginLeft: 20}} icon="arrow-right">
              <Link to="/project_list/mine" replace>我的项目列表</Link>
          </Button>
        </div>
        <ModelEdit hide={() => {this.setState({visible_model: false})}} initValues={{project_id: parseInt(this.project_id)}} type="add" visible={this.state.visible_model}></ModelEdit>
     </div>
    );
  }
}
