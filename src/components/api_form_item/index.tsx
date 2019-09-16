import * as React from 'react';
import { Select, Row, Col, Button, Input, Icon } from 'antd';
import './index.scss'
import { HEADERS_KEYS } from '../../assets/js/constants';
import { ContentItem } from '../../views/api_edit';
export interface ISelectSingleProps {
  values: (string | number)[]
  initvalue?: (string | number)
  onChange?: any
  disabled?: boolean
}

export class SelectSingle extends React.Component<ISelectSingleProps> {
  public render() {
    const {values, initvalue} = this.props
    return (
      <Select disabled={this.props.disabled} defaultValue={initvalue} onChange={this.props.onChange}>
        {values.map(item => {
          return <Select.Option key={item} value={item}>{item}</Select.Option>
        })}
      </Select>
    );
  }
}
export interface IEditHeaderleProps {
  keys?: (string | number)[]
}

export class EditHeader extends React.Component<IEditHeaderleProps>{
  public render() {
    return (
      <Row align="middle" className="text-c edit_header">
        <Col className="edit_header_item" span={6}>Key</Col>
        <Col className="edit_header_item" span={6}>Type</Col>
        <Col className="edit_header_item" span={6}>Value</Col>
        <Col className="edit_header_item" span={6}>Operator</Col>
      </Row>
    )
  }
}
export const Types = (props: {init?: string | null, onChange?: (e:any)=> void}) => (<SelectSingle onChange={props.onChange}  initvalue={props.init || 'string'} values={['string', 'number', 'array', 'object']}></SelectSingle>)
export const Header_Keys = (<SelectSingle values={HEADERS_KEYS}></SelectSingle>)

export interface IEditContentleProps {
  content: ContentItem
  index: number
  onEdit?: (type: string, id: number) => void
  onChange?: (type: string, id: number, vaule: string) => void
}
export class EditContent extends React.Component<IEditContentleProps, {open: boolean}>{
  constructor(props: IEditContentleProps){
    super(props)
    this.state = {
      open: true
    }
  }
  inputOnChange = (type: string) => {
    return (e: any) => {
      this.props.onChange && this.props.onChange(type, this.props.content.id, typeof e === 'string' ? e : e.target.value)
    }
  }
  public render() {
    const {key_name, value, type, children, id, parentItem} = this.props.content
    const steps = this.props.content.steps()
    return (
      <React.Fragment>
        <Row className="text-c edit_content_item">
          <Col style={{paddingLeft: steps.length * 10, display: 'flex', alignItems: 'center'}} className="edit_header_item " span={6}>
            {children !== undefined && (this.state.open ? <Icon type="caret-down" onClick={() => {this.setState({open: false})}}/> : <Icon type="caret-right" onClick={() => {this.setState({open: true})}}/>)}
            {<Input defaultValue={key_name + ''} onBlur={this.inputOnChange('key_name')}></Input>}
          </Col>
          <Col className="edit_header_item" span={6}>
              <Types  onChange={this.inputOnChange('type')}  init={type}></Types>
          </Col>
          <Col  className="edit_header_item" span={6}>{value !== null &&  value !== undefined && <Input onBlur={this.inputOnChange('value')}  defaultValue={value + ''} ></Input>}</Col>
          <Col  className="edit_header_item" span={6}>
            {(this.props.index !== 0 || (parentItem && parentItem.children && parentItem.children.length > 0)) && <Button icon="minus-circle" type="link" size="large" onClick={() => {this.props.onEdit && this.props.onEdit('minus', id)}}></Button>}
            {!['arrary', 'object'].includes(type) && <Button icon="plus-circle" type="link" size="large" onClick={() => {this.props.onEdit && this.props.onEdit('plus', id)}}></Button>}
          </Col>
        </Row>
        { this.state.open && children !== undefined && children.map((item, index) => {
         return  <EditContent index={index} onChange={this.props.onChange} content={item} key={item.id} onEdit={this.props.onEdit}></EditContent>
        })}
      </React.Fragment>
    )
  }
}


