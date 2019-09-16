import * as React from 'react';
import { Modal, Input, Form, Select, notification } from 'antd';
import ApiForm from '../api_form';
import { FormComponentProps } from 'antd/lib/form';
import Requests from '../../api';
import { connect } from 'react-redux';
import { addModels } from '../../redux/actions';

export interface IModelEditProps extends FormComponentProps {
  type: string
  visible: boolean
  initValues?: any
  hide: (type?: string) => void
  addModel: (model: any) => void
}

export interface IModelEditState {
  projects: any[]
  loading: boolean
}

class ModelEdit extends React.Component<IModelEditProps, IModelEditState> {
  title: string
  constructor(props: IModelEditProps) {
    super(props);
    this.state = {
      projects: [],
      loading: false
    }
    this.title = this.props.type === 'add' ? '添加模块' : '编辑模块'
  }
  componentDidMount() {
    Requests.queryProject({type: 'mine', limit: 1000, page: 1}).then((data) => {
      if (data.code === 200) {
        this.setState({
          projects: data.data.list
        })
      }
    })
  }
  handlerCancel() {
    this.props.hide()
    this.props.form.resetFields()
  }
  handlerOk() {
    this.setState({loading: true})
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.props.type === 'add') {
          Requests.addModel(values).then((data) => {
            if (data.code === 200) {
              notification.success({
                message: '模块创建成功！'
              })
              this.props.addModel(Object.assign({}, values, data.data))
              this.props.form.resetFields()
              this.props.hide()
            }
          }).finally(() => {
            this.setState({loading: false})
          })
        } else {
          Requests.updateModel(Object.assign({}, values, {model_id: this.props.initValues.model_id})).then((data) => {
            if (data.code === 200) {
              notification.success({
                message: '模块更新成功！'
              })
              this.props.form.resetFields()
              this.props.hide('edit_end')
            }
          }).finally(() => {
            this.setState({loading: false})
          })
        }
      }
    })
  }
  public render() {
    const projectSelect = (
      <Select placeholder="所属项目">
        {this.state.projects.map(item => <Select.Option key={item.project_id} value={item.project_id}>{item.title}</Select.Option>)}
      </Select>
    )
    const form_list = [
      {lable: '模块名称', key: 'title', sheet: (<Input placeholder="模块名称"/>), rules: [{required:true, message: '请填写模块名称'}], init_value: this.props.initValues},
      {lable: '模块域名', key: 'host', sheet: (<Input placeholder="模块域名, eg: http://127.0.0.1:3000"/>), rules: [{required:true, message: '请填写模块域名'}, {type: 'url', message: '域名格式不正确'}], init_value: this.props.initValues},
      {lable: '模块base_url', key: 'base_url', sheet: (<Input placeholder="模块base_url , eg: /api or api"/>), rules: [], init_value: this.props.initValues},
      {lable: '所属项目', key: 'project_id', sheet: projectSelect, rules: [{required:true, message: '请填写模块名称'}], init_value: this.props.initValues},
      {lable: '模块描述', key: 'description', sheet: (<Input.TextArea placeholder="模块描述"/>), rules: [{required:true, message: '请填写模块描述'}], init_value: this.props.initValues},
    ]
    return (
      <Modal okText="确定" cancelText="取消" okButtonProps={{loading: this.state.loading}} onOk={this.handlerOk.bind(this)} onCancel={this.handlerCancel.bind(this)}  visible={this.props.visible} title={this.title}>
        <ApiForm form={this.props.form} form_list={form_list}></ApiForm>
      </Modal>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch)=> ({
    addModel: (model: any) => {
      dispatch(addModels(model))
    }
  })
)(Form.create<IModelEditProps>()(ModelEdit))