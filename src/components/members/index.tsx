import * as React from 'react';
import { Select, Spin} from 'antd';
import Requests from '../../api';

type User = {
  id: number
  username: string
  pet_name: string
}
export interface IMembersSelectProps {
  defaultValue?: any
  onChange?: any
  value?: any[]
  initMembers?: User[]
}
export interface IMembersSelectStates{
  members: User[]
  searching: boolean,
  value: any
}


export default class MembersSelect extends React.Component<IMembersSelectProps, IMembersSelectStates> {
  readonly state: IMembersSelectStates
   timer : any
  constructor(props: IMembersSelectProps){
    super(props)
    this.state = {
      members: [],
      searching: false,
      value: []
    }
    this.timer = null
  }
  componentDidMount() {
    this.setState({
      members: this.props.initMembers ? [...this.props.initMembers] : [],
    })
  }
  searchMembers = (value: string) => {
    this.setState({searching: true})
    if (!value) {
      clearTimeout(this.timer)
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      Requests.getUsers(value).then((data) => {
        this.setState({searching: false, members: data.data})
      }).catch(() => {
        this.setState({searching: false, members: []})
      })
    }, 800)
  }
  handleChange= (value:any) => {
    this.setState({searching: false, members: []})
    this.props.onChange && this.props.onChange(value)
  }

  public render() {
    const {members, searching} = this.state
    const {initMembers = [], value = []} = this.props
    const formatMembers = initMembers.concat(members.filter(item => !value.includes(item.id)))
    console.log(this.props)
    return (
      <Select mode="multiple"  onChange={this.handleChange} value={value}  onSearch={this.searchMembers} filterOption={false}  notFoundContent={searching ? <Spin></Spin> : null} placeholder="请选择项目成员">
          {formatMembers.map(item => <Select.Option key={item.id} title={`${item.pet_name}(${item.username})`} value={item.id}>{`${item.pet_name}(${item.username})`}</Select.Option>)}
      </Select>
    );
  }
}
