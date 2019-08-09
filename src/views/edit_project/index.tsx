import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Card, Form, Input, Button } from 'antd';
import ApiForm, { Form_Item } from '../../components/api_form';
import { FormComponentProps } from 'antd/lib/form';
import Requests from '../../api';
import { connect } from 'react-redux';
import MembersSelect from '../../components/members';

export interface IProjectEditProps extends RouteComponentProps<{project_id: string}>, FormComponentProps {
  created_user: number
}
type IProjectEditStates = {
  detail: any
}
class ProjectEdit extends React.Component<IProjectEditProps, IProjectEditStates> {
  private project_id: string
  readonly state: IProjectEditStates
  constructor(props: IProjectEditProps){
    super(props)
    this.project_id = this.props.match.params.project_id
    this.state = {
      detail: {}
    }
  }
  componentDidMount(){
    if (this.project_id === 'add') {
      document.title = "添加项目"
    } else {
      document.title = "编辑项目"
      Requests.getProDetail(parseInt(this.project_id)).then((data) => {
        if (data.code === 200) {
          this.setState({
            detail: data.data
          })
        }
      })
    }
  }
  submit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      console.log(values)
      if (!err) {
        if (this.project_id === 'add') {
          Requests.addProject(Object.assign({}, values)).then(() => {
            this.props.history.go(-1)
          })
        } else {
          Requests.updateProject(Object.assign({}, values, {project_id: this.project_id})).then(() => {
            this.props.history.go(-1)
          })
        }
      }
    })
    
  }
  public render() {
    console.log(this.state.detail)
    const selectValues = this.state.detail.members ? this.state.detail.members.map((item: any) => item.id) : []
    const form_lists: Form_Item[] = [
      {lable: '项目名称', key: 'title', sheet: (<Input placeholder="项目名称"/>), rules: [{required:true, message: '请填写项目名称'}], init_value: this.state.detail},
      // {lable: 'BaseUrl',key: 'base_url', sheet: (<Input placeholder="项目BaseUrl"/>), rules: [{pattern: /^[/][a-z]*$/, message: 'url格式不正确'}], init_value: this.state.detail ? this.state.detail : '/'},
      {lable: '项目成员', key: 'members', sheet: (<MembersSelect initMembers={this.state.detail.members}></MembersSelect>), init_value: selectValues},
      {lable: '项目描述', key: 'description', sheet: (<Input.TextArea placeholder="项目描述" rows={4}/>), rules: [{required:true, message: '请填写项目描述'}],init_value: this.state.detail},
    ]
    return (
      <Card className="project-edit" title={this.project_id === 'add' ? '添加项目' : '编辑项目'}>
          <ApiForm styles={{width:400}}   form={this.props.form} form_list={form_lists}>
            <div className="flex-center">
              <Button type="primary" onClick={() => {this.submit()}}>保存</Button>
            </div>
          </ApiForm>
      </Card>
    );
  }
}

export default Form.create({name: 'project_edi'})(connect((state: any) => {
  return {
    created_user: state.userInfor.id
  }
})(ProjectEdit))
