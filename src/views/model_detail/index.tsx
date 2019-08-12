import * as React from 'react';
// import './index.scss'
import { RouteComponentProps, withRouter } from 'react-router';
import Requests from '../../api';
import {Button, Descriptions, Table, Input, Tag, Modal} from 'antd'
import ModelEdit from '../../components/model_edit';
import { Link } from 'react-router-dom';
import { METHODS_COLOR } from '../../assets/js/constants';
import TestLog from '../../components/test_console';
import { connect } from 'react-redux';
import { addLogs, loadingLog, removeModels } from '../../redux/actions';
import Column from 'antd/lib/table/Column';
import { ColumnProps } from 'antd/lib/table';
export interface IDetailModelProps extends RouteComponentProps<{model_id: string}> {
  addLog: (log: any) => void
  loadingLog: (loading: boolean) => void
  removeModel: (id: string) => void
  userInfo: any
  logs: any[]
  loading: boolean
}
export interface IDetailModelStates  {
  detail: any
  visible_model: boolean
  api_lists: any[]
  total: number
  showLog: boolean
}
class DetailModel extends React.Component<IDetailModelProps, IDetailModelStates> {
  readonly state: IDetailModelStates
  model_id: string
  limit: number
  page: number
  times: number
  search: string
  constructor(props: IDetailModelProps) {
    super(props)
    this.state = {
      detail: {},
      visible_model: false,
      api_lists: [],
      total: 0,
      showLog: false
    }
    this.model_id = props.match.params.model_id
    this.limit = 10
    this.page = 1
    this.search = ''
    props.history.listen(({state}) => {
      if (state) {
        this.model_id = state
        this.getDetail()
        this.getApis()
      }
    })
    this.times = 0
  }
  getDetail() {
    Requests.getModel(this.model_id).then((data) => {
      if (data.code === 200) {
        this.setState({
          detail: data.data
        })
      }
    })
  }
  getApis() {
    Requests.getModelApis({model_id: this.model_id, limit: this.limit, page: this.page, search: this.search}).then((data) => {
      if (data.code === 200) {
        this.setState({
          api_lists: data.data.lists,
          total: data.data.total
        })
      }
    })
  }
  searchApi = (val: string) => {
    this.search = val
    this.getApis()
  }
  componentDidMount() {
    this.getDetail()
    this.getApis()
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
        return;
    }
  }
  showModel = ()=> {
    this.setState({
      visible_model: true
    })
  }
  showLogAction = () => {
    if (this.state.showLog === false) {
      this.setState({
        showLog: true
      })
    }
  }
  handlerTableChange = (pagination: any) => {
    this.limit = pagination.pageSize
    this.page = pagination.current
    this.getApis()
  }
  handlerHide = (type?: string) => {
    if (type === 'edit_end') {
      this.getDetail()
    }
    this.setState({
      visible_model: false
    })
  }
  testApi = (id: string) => {
    return () => {
      this.showLogAction()
      this.props.loadingLog(true)
      Requests.testApi(id).then((data) => {
        if (data.code === 200) {
          this.props.addLog(data.data)
        }
      }).finally(() => {
        this.props.loadingLog(false)
      })
    }
  }
  testModel = () => {
    this.props.loadingLog(true)
    this.showLogAction()
    Requests.testModelApi(this.model_id).then(({data}) => {
      if (data.code === 200) {
        this.testMessage()
      }
    })
  }
  testMessage() {
    Requests.testMessage().then((data) => {
      if (data.code === 200) {
        if (data.data.length > 0) {
          this.times = 0
        } else {
          this.times++
        }
        if(this.times >= 4) {
          this.props.loadingLog(false)
          this.times = 0
        } else {
          Array.isArray(data.data) && this.props.addLog(data.data)
          setTimeout(() => {
            this.testMessage()
          }, 3000)
        }
      }
    })
  }
  deleteApi = (id: string) => {
    return () => {
      Modal.confirm({
        title: '删除',
        content: '确认删除当前的Api接口吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          Requests.deleteApi(id).then(({data}) => {
            if (data.code === 200) {
              this.getApis()
            }
          })
        }
      })
     
    }
  }
  deleteModel = () => {
    Modal.confirm({
      title: "删除模块",
      content: "确认删除该模块吗？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        Requests.deleteModel(this.model_id).then(({data}) => {
          if (data.code === 200) {
            this.props.history.goBack()
            this.props.removeModel(this.model_id)
          }
        })
      }
    })
  }
  public render() {
    const user_id = this.props.userInfo.id
    const role = this.props.userInfo.role
    const showEdit = role === 1 || user_id === this.state.detail.create_user
    const columns: ColumnProps<any>[] = [
      {
        title: '接口名称',
        dataIndex: 'title',
        key: 'title',
        align: "center"
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        key: 'method',
        align: "center",
        render: (text: any, record: any) => {
          return (
            <Tag color={METHODS_COLOR.get(record.method)}>{record.method.toUpperCase()}</Tag>
          )
        }
      },
      {
        title: '请求路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '接口备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'action',
        width: 220,
        align: "center",
        render: (text: any, record: any) => {
          return (
            <div className="flex-c">
              <Button type="primary" size="small" style={{marginRight: 20}}>
                <Link to={this.model_id + '/api/' + record.api_id}>查看编辑</Link>
              </Button>
              <Button type="primary" size="small" style={{marginRight: 20}} onClick={this.testApi(record.api_id)}>接口测试</Button>
              <Button type="danger" size="small" onClick={this.deleteApi(record.api_id)}>删除</Button>
            </div>
          )
        }
      },
    ]
    return (
      <div className="detail-Model">
        <Descriptions bordered title={
        <div className="flex-c">
          <span style={{paddingRight: 10}}>{this.state.detail.title}</span>
          {showEdit && <Button onClick={this.showModel} type="link" icon="edit"></Button>}
          <div className="flex-1 text-r">
           {showEdit && <Button onClick={this.deleteModel} type="danger" icon="delete"></Button>}
          </div>
        </div>}>
        <Descriptions.Item label="模块域名" span={1}>{this.state.detail.host}</Descriptions.Item>
          <Descriptions.Item label="base_url" span={2}>{this.state.detail.base_url}</Descriptions.Item>
          <Descriptions.Item label="模块描述" span={3}>{this.state.detail.description}</Descriptions.Item>
        </Descriptions>
        <h3 style={{padding: '20px 0px'}}>API 列表</h3>
        <div className="flex-c" style={{paddingBottom: 20, justifyContent: 'flex-end'}}>
          <div className="flex-1">
            <Button loading={this.props.loading} type="primary" onClick={this.testModel}>模块API接口测试</Button>
            <Button type="primary" style={{marginLeft: 20}} >
              <Link to={this.props.location.pathname + '/api/add'}>添加Api接口</Link>
            </Button>
          </div>
          <div >
           <Input.Search onSearch={this.searchApi} placeholder="请输入关键字"  enterButton={true}/>
          </div>
        </div>
        {this.state.showLog && (<TestLog  onClose={() => {this.setState({showLog: false})}}></TestLog>)}
        <Table  rowKey="api_id" onChange={this.handlerTableChange} pagination={{total: this.state.total, pageSize: this.limit, current: this.page}} columns={columns} dataSource={this.state.api_lists}></Table>
        <ModelEdit hide={this.handlerHide}  initValues={this.state.detail} type="edit" visible={this.state.visible_model}></ModelEdit>
     </div>
    );
  }
}
export default connect((state :any)=>({
  loading: state.logs.loading,
  userInfo: state.userInfor
}), (dispatch) =>( {
  addLog: (data: any) => {
    dispatch(addLogs(data))
  },
  loadingLog: (loading: boolean) => {
    dispatch(loadingLog(loading))
  },
  removeModel: (model_id: string) => {
    dispatch(removeModels(model_id))
  }
}))(withRouter(DetailModel))