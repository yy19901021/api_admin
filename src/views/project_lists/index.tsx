import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ProjectItem from '../../components/project_item';
import { Row, Col, Button, Pagination, Empty, Upload } from 'antd';
import Requests from '../../api';

export interface IProjectListProps extends RouteComponentProps<{type: string}> {

}
export interface IProjectListState {
  list: any[],
  total: number,
}
export default class ProjectList extends React.Component<IProjectListProps, IProjectListState> {
  readonly state :IProjectListState
  limit: number
  page: number
  type: string
  constructor(props: IProjectListProps){
    super(props)
    this.state = {
      list: [],
      total: 0,
    }
    this.props.history.listen((location) => {
      if (!location.state || !location.state.type) {
        return
      }
      this.type = location.state.type
      this.queryproject()
    })
    this.limit = 12
    this.page = 1
    this.type = this.props.match.params.type
  }
  componentDidMount() {
    this.queryproject()
  }
  queryproject = () => {
    const limit = this.limit, page = this.page, type = this.type
    Requests.queryProject({limit, page, type}).then((data) => {
      if (data.code === 200) {
        this.setState({
          list: data.data.list,
          total: data.data.total
        })
      }
    })
  }
  toCreateProject = (project_id: string) => {
    this.props.history.push('/project/' + project_id)
  }
  
  changeLimit = (current: number, pageSize: number) => {
    this.limit = pageSize
    this.page = current
    this.queryproject()
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
        return;
    }
  }
  upload = (file: any): boolean => {
    console.log(file)
    const data = new FormData()
    data.append("file", file)
    data.append("key", "file")
    Requests.importJson(data).finally(() => {
      this.queryproject()
    })
    return false
  }
  changePage = (page: number) => {
    this.page = page;
    this.queryproject()
  }
  
  public render() {
    const {list, total} = this.state
    return (
      <React.Fragment>
        <div className="flex-c" style={{paddingBottom: 20}}>
          <div className="flex-1"></div>
          <Button icon="plus-circle" type="primary" onClick={() => {this.toCreateProject('add')}}>添加项目</Button>
          <Upload accept=".json,image/*" beforeUpload={this.upload} showUploadList={false} >
             <Button icon="import" type="default" style={{marginLeft: 20}}>导入json</Button>
          </Upload>
        </div>
        <Row gutter={20}>
         {list.length > 0 ? list.map(item => ( <Col span={6} key={item.project_id} style={{marginBottom:30}}>
            <ProjectItem onDel={this.queryproject} title={item.title} desc={item.description} id={item.project_id} create_user={item.created_user}></ProjectItem>
          </Col>)) : <Empty/>}
        </Row>
        <div className="project-page flex-c">
          <div className="flex-1"></div>
          {/* <div style={{paddingRight: 20}}>总数 {total}</div> */}
          <Pagination defaultCurrent={1} pageSizeOptions={['12', '24', '36']} defaultPageSize={12} total={total} onChange={this.changePage} showSizeChanger onShowSizeChange={this.changeLimit}></Pagination>
        </div>
      </React.Fragment>
    );
  }
}
