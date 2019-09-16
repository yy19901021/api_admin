import * as React from 'react';
import { Card, Avatar, Icon, Modal, notification} from 'antd';
import './index.scss';
import Requests from '../../api';
import { connect } from 'react-redux';
import Classnames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';
export interface IProjectItemProps {
  id: number
  title: string
  desc: string
  create_user: number
  onDel: () => void
  user_id: number
}

const {confirm} = Modal
class ProjectItem extends React.Component<IProjectItemProps & RouteComponentProps> {
  toDetail = () => {
    this.props.history.push('/projectDetail/' + this.props.id)
    // Requests.getProDetail(this.props.id).then((data) => {
    //   console.log(data)
    // })
  }
  del = () => {
    confirm({
      title: '你确定要删除这个项目吗？',
      content: '项目删除后将不再显示在你的项目列表中！',
      okText: "删除",
      cancelText: '取消',
      onOk: () => {
        Requests.delProject(this.props.id).then((data) => {
          if (data.code === 200) {
            notification.success({
              message: data.msg
            })
            this.props.onDel()
          }
        })
      }
    })
  }
  toEdit() {
    this.props.history.push('/project/' + this.props.id)
  }
  public render() { 
    console.log(this.props.create_user - this.props.user_id)
    const actions: any = [<Icon className="flex-1 border-r" type="edit" key="edit" onClick={this.toEdit.bind(this)}/>, 
    <Icon className={Classnames("flex-1 border-r", {'btn-disabled': this.props.create_user - this.props.user_id !==  0})}  type="delete" style={{color: this.props.create_user - this.props.user_id === 0 ? '': "#ccc"}}   key="delete" onClick={this.props.create_user - this.props.user_id ===  0 ? this.del : () => {}}/>, 
    <Icon  type="arrow-right" key="link" className="flex-1" onClick={this.toDetail}/>
    ]
    return (
      <div className="project-item">
        <Card actions={actions}>
            <Card.Meta
              title={this.props.title}
              description={this.props.desc}
              avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>项目</Avatar>}
            ></Card.Meta>
        </Card>
        {/* <div className="project-item-actions">{actions}</div> */}
      </div>
    );
  }
}

export default connect((state: any) =>({
  user_id: state.userInfor.id,
}))(withRouter(ProjectItem))