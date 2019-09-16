import * as React from 'react';
import {RouteComponentProps } from 'react-router';
import { Form, Select, Input, Row, Col, Button, Tabs, Modal, notification, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormComponentProps } from 'antd/lib/form';
import { METHODS } from '../../assets/js/constants';
import Requests from '../../api';
import { EditHeader, EditContent } from '../../components/api_form_item';


let id = 0
export class ContentItem {
  parentItem?: ContentItem
  children?:ContentItem[]
  key_name: (string | number)
  value: (string | number | null)
  type: string
  readonly id: number
  constructor(key: (string | number), value: any, lists: ContentLists , parent?: ContentItem) {
    this.id = ++id
    this.key_name = key
    if (typeof value !== 'object') {
      this.value = value
      this.type = typeof value
    } else {
      this.type = Array.isArray(value) ? 'array': 'object'
      this.value = null
      this.children = []
    }
    if (parent) {
      this.parentItem = parent
      parent.appendChild(this)
    }
    lists.setMap(this)
  }
  steps(): (string | number)[] {
    const steps = this.parentItem ? this.parentItem.steps() : []
    return steps.concat(this.key_name)
  }
  appendChild(child: ContentItem) {
    this.children && this.children.push(child)
  }
}

class ContentLists {
  initvalue: any
  steps:any[]
  values: ContentItem[]
  contentMap: Map<number, ContentItem>
  constructor(props?:any) {
    this.initvalue = props
    this.steps = []
    this.contentMap = new Map()
    this.values =this.formatTo(this.initvalue)
  }
  private formatTo(data?: any, parnet?: any):  ContentItem[]{
    if (!data) {
      const emptyObj = new ContentItem('', '', this)
      return [emptyObj]
    }
    if (Array.isArray(data)) {
      data = [data[0]]
    }
    let result: ContentItem[] = []
    Object.keys(data).forEach((item,index) => {
      this.steps.push(item)
      const value = data[item]
      if (value !== null) {
        const itemObj1 = new ContentItem(item, value, this, parnet)
        this.setMap(itemObj1)
        if (typeof value === 'object') {
          this.formatTo(value, itemObj1)
        }
        result.push(itemObj1)
      }
      this.steps.pop()
    })
    return result
  }
  getItemById(id: number) {
    return this.contentMap.get(id)
  }
  setMap(data: ContentItem) {
    this.contentMap.set(data.id, data)
  }
  addContent(id: number) {
    const contentitem = this.getItemById(id)
    const parent = contentitem && contentitem.parentItem
    const empty = new ContentItem('','', this)
    empty.parentItem = parent
    if(contentitem && parent && parent.children) {
      const index = parent.children.findIndex(item => item.id === id)
      parent.children.splice(index + 1, 0, empty)
    } else {
      const index = this.values.findIndex(item => item.id === id)
      this.values.splice(index + 1, 0, empty)
    }
    return this
  }
  isComplex(type: string) {
    return ['array', 'object'].includes(type)
  }
  private editType(contentitem: ContentItem, value: string) {
    const isComplex = this.isComplex(contentitem.type)
    let empty: ContentItem = new ContentItem('', '', this)
    empty.parentItem = contentitem
    if (isComplex && value !== contentitem.type) {
      if (this.isComplex(value)) {
        contentitem.children && (contentitem.children = [empty])
      } else {
        contentitem.children && (contentitem.children = undefined)
        contentitem.value = ''
      }
    } else if (!isComplex && this.isComplex(value)) {
      contentitem.children = [empty]
      contentitem.value = null
    }
    contentitem.type = value
    if (value === 'number') {
      contentitem.value = 100
    } else if (value === 'string') {
      contentitem.value = ''
    }
  }
  editContent(type: string, id: number, value: string) {
      const contentitem = this.getItemById(id)
      if (!contentitem) {
        return this
      }
      switch (type) {
        case 'key_name':
            contentitem.key_name = value
         break;
        case 'value':
            contentitem.value = value
          break;
        case 'type':
          this.editType(contentitem, value)
          break;
        default:
          break;
      }
      console.log(contentitem)
      return this
  }
  removeContent(id: number) {
    const contentitem = this.getItemById(id)
    const parent = contentitem && contentitem.parentItem
    if(contentitem && parent && parent.children) {
      const index = parent.children.findIndex(item => item.id === id)
      parent.children.splice(index, 1)
    } else {
      const index = this.values.findIndex(item => item.id === id)
      this.values.splice(index, 1)
    }
    return this
  }
  toJson(value?: any[], container?: any) {
    container = container || {}
    const values: any = value || this.values
      values.forEach((item: ContentItem, index: number) => {
        if(item.key_name === '') {
          return
        }
        if (Array.isArray(container)) {
          if (item.type === 'string') {
            container.push(item.value)
          } else if(item.type === 'number') {
            container.push(parseInt((item.value as string)))
          } else {
            if (item.type === 'array') {
              container[index] = []
            } else {
              container[index] = {}
            }
            this.toJson(item.children, container[index])
          }
        } else {
          if (item.type === 'string') {
            container[item.key_name] = item.value
          } else if(item.type === 'number') {
            container[item.key_name] = parseInt((item.value as string))
          }else {
            if (item.type === 'array') {
              container[item.key_name] = []
            } else {
              container[item.key_name] = {}
            }
            this.toJson(item.children, container[item.key_name])
          }
        }
      })
      return container
  }
}


export interface IAPIEditProps extends RouteComponentProps<{model_id: string, api_id: string}>, FormComponentProps {
  
}

export interface IAPIEditState {
  api_url: string
  body: ContentLists
  params: ContentLists
  headers: ContentLists
  result: ContentLists
  showJsonModel: boolean
  title: string
  method: string
  path: string
  remark: string
  response: any
}

function formatUrl(...arg:string[]) {
  const url = arg.reduce((pre, item) => {
    if (item === undefined || item === null) {
      item = ''
    }
    if (pre.match(/\/+$/)) {
      pre = pre.replace(/\/+$/, '')
    } 
    pre += '/'
    if (item.match(/^\/+/)) {
      item = item.replace(/^\/+/, '')
    }
    return pre + item
  })
  return url
}

class APIEdit extends React.Component<IAPIEditProps, IAPIEditState> {
  model_id: string
  model_url: string
  api_detail: any
  activeKey: string
  jsonData: string
  api_id: string
  constructor(props: IAPIEditProps) {
    super(props)
    console.log(props.match.params)
    this.model_id = props.match.params.model_id
    this.model_url = ''
    this.api_id = props.match.params.api_id
    this.api_detail = {}
    this.activeKey = 'Headers'
    this.jsonData = JSON.stringify({}, null, "\t")
    this.state = {
      api_url: '',
      title: '',
      method: 'get',
      path: '',
      remark: '',
      showJsonModel: false,
      headers: new ContentLists(),
      body: new ContentLists(),
      result: new ContentLists(),
      params: new ContentLists(),
      response: null
    }
  }
  getModelUrl() {
    Requests.getModel(this.model_id).then((data) => {
      if (data.code === 200) {
        this.model_url = formatUrl(data.data.host, data.data.base_url)
        this.setState({
          api_url: formatUrl(this.model_url , this.api_detail.path)
        })
      }
    })
  }
  pathChange = (e: React.ChangeEvent<any>) =>  {
    const {setFieldsValue} = this.props.form
    const path = e.target.value || ''
    setFieldsValue({'api_url': formatUrl(this.model_url, path)})
  }
  changeContent = (type: string, id: number) => {
    function change(newState: ContentLists) {
      if (type === 'plus') {
        newState.addContent(id)
      } else if(type === 'minus') {
        newState.removeContent(id)
      }
      return newState
    }
    switch (this.activeKey) {
      case 'Headers':
        this.setState((state)=>{
          return {
            headers: change(state.headers)
          }
        })
        break;
      case 'Params':
          this.setState((state)=>{
            return {
              params: change(state.params)
            }
          })
        break;
      case 'Body':
          this.setState((state)=>{
            return {
              body: change(state.body)
            }
          })
        break;
      case 'Result Template':
          this.setState((state)=>{
            return {
              result: change(state.result)
            }
          })
        break;
      default:
        return;
    }
  }
  changeValues = (type: string, id:number, value: string) => {
    switch (this.activeKey) {
      case 'Headers':
          this.setState((state) => ({
            headers: state.headers.editContent(type, id, value)
          }))
        break;
      case 'Params':
          this.setState((state) => ({
            params: state.params.editContent(type, id, value)
          }))
        break;
      case 'Body':
          this.setState((state) => ({
            body: state.body.editContent(type, id, value)
          }))
        break;
      case 'Result Template':
          this.setState((state) => ({
            result: state.result.editContent(type, id, value)
          }))
        break;
      default:
        return;
    }
     
  }
  tabsChange = (key: string) => {
    this.activeKey = key
  }
  jsonEdit = () => {
    this.setState({
      showJsonModel: true
    })
    const curentState = this.getCurentState()
    this.jsonData = curentState ? JSON.stringify(curentState.toJson(), null, '\t') : JSON.stringify({}, null, "\t")
  }
  modelOk = () => {
    const values = this.props.form.getFieldValue('json')
    this.changeCurentState(new ContentLists(JSON.parse(values)))
    this.hideModel()
  }
  getCurentState() {
    switch (this.activeKey) {
      case 'Headers':
          return this.state.headers
      case 'Params':
          return this.state.params
      case 'Body':
          return this.state.body
      case 'Result Template':
          return this.state.result
      default:
        return;
    }
  }
  changeCurentState(value: ContentLists, key?: string) {
    const activeKey = key || this.activeKey
    switch (activeKey) {
      case 'Headers':
          this.setState({
            headers: value
          })
        break;
      case 'Params':
          this.setState({
            params: value
          })
          break;
      case 'Body':
          this.setState({
            body: value
          })
          break;
      case 'Result Template':
          this.setState({
            result: value
          })
          break;
      default:
        return;
    }
  }
  hideModel = () => {
    this.setState({showJsonModel: false})
    this.props.form.resetFields(['json'])
  }
  getApiDetail() {
    function parserJson(str: string) {
      return !!str ? JSON.parse(str) : ''
    }
    if (this.api_id !== 'add') {
      Requests.getApiById(this.api_id).then((data) => {
        if(data.code === 200) {
          this.setState({
            headers: new ContentLists(parserJson(data.data.headers)),
            body: new ContentLists(parserJson(data.data.body)),
            params: new ContentLists(parserJson(data.data.params)),
            result: new ContentLists(parserJson(data.data.result)),
            title: data.data.title,
            method: data.data.method,
            path: data.data.path,
            remark: data.data.remark,
          })
        }
      })
    }
  }
  editOrAddApi = (callback?: () => void) => {
    const { validateFields } = this.props.form
    const {body, params, headers, result} = this.state
    const data: any =  {model_id: this.model_id, body: body.toJson(), params: params.toJson(), headers: headers.toJson(), result: result.toJson()}
    this.api_id !== 'add' && (data.api_id = this.api_id)
    validateFields(['path', 'method', 'title', 'remark'],(err, values: any) => {
      if(!err) {
        Requests.eidtApi(Object.assign({}, data, values)).then((data) => {
          if (data.code === 200) {
            notification.success({
              message: '操作成功！'
            })
          }
        })
      }
    })
  }
  test = () => {
    const {body, params, headers, result} = this.state
    const api_url = this.props.form.getFieldValue('api_url')
    const method = this.props.form.getFieldValue('method')
    Requests.sendApi({body: body.toJson(), params: params.toJson(), headers: headers.toJson(), result: result.toJson(), method, api_url}).then((data) => {
      if (data.code === 200) {
        this.setState({
          response: JSON.stringify(data.data)
        })
      }
    })
  }
  saveToTemplate = () => {
    const values = this.props.form.getFieldValue('response_result')
    this.changeCurentState(new ContentLists(JSON.parse(values)), 'Result Template')
  }
  componentDidMount() {
    this.getModelUrl()
    this.getApiDetail()
  }
  public render() {
    const {getFieldDecorator} = this.props.form
    const {body, params, headers, result, title, path, method, remark} = this.state
    const Sheet = (props: {content: ContentLists}) => {
      return (
        <React.Fragment>
          <EditHeader></EditHeader>
          {props.content.values.map((item, index) => (
            <EditContent index={index} key={item.id} onEdit={this.changeContent} onChange={this.changeValues} content={item} ></EditContent>
          ))}
        </React.Fragment>
      )
    }
    const TabsContent = [{
      key: 'Headers',
      node: (<Sheet content={headers}></Sheet>)
    }, {
      key: 'Params',
      node: (<Sheet content={params}></Sheet>)
    }, {
      key: 'Body',
      node: (<Sheet content={body}></Sheet>)
    },{
      key: 'Result Template',
      node: (<Sheet content={result}></Sheet>)
    }
  ]
    return (
      <div>
        <h3>API接口</h3>
        <Form layout="inline">
          <Row gutter={20} type="flex">
            <Col span={6}>
              <FormItem label="接口名称">
                {getFieldDecorator('title', {initialValue: title, rules: [{required: true, message: '请填写接口名称'}]})(
                <Input  placeholder="接口名称"></Input>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="请求方式">
              {getFieldDecorator('method', {initialValue: method})(
                <Select >
                  {METHODS.map(item => <Select.Option key={item.key} value={item.key}>{item.key.toUpperCase()}</Select.Option>)}
                </Select>
              )}
            </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="请求路径">
                {getFieldDecorator('path', {initialValue: path})(
                <Input onChange={this.pathChange} style={{width: 260}} placeholder="url"></Input>
                )}
              </FormItem>
            </Col>
            </Row>
            <Row>
              <Col span={18} style={{marginTop: 20}}>
                <FormItem label="实际路径">
                  {getFieldDecorator('api_url', {initialValue: formatUrl(this.state.api_url , this.state.path)})(
                    <Input readOnly disabled style={{width: 730}} placeholder="url"></Input>
                  )}
                </FormItem>
              </Col>
              <Col span={6} style={{marginTop: 20}}>
                  <Button type="primary" style={{marginRight:20}} onClick={this.test}>发送请求</Button>
                  <Button type="primary" onClick={() => {this.editOrAddApi()}}>保存请求</Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Tabs onChange={this.tabsChange} tabBarExtraContent={<Button type='primary' size="small" icon="edit" onClick={this.jsonEdit}>JSON</Button>}>
                  {TabsContent.map(item => {
                    return <Tabs.TabPane tab={item.key} key={item.key} >{item.node}</Tabs.TabPane>
                  })}
                </Tabs>
              </Col>
              <Col span={24} style={{marginTop: 20}}>
                <FormItem label="接口描述">
                    {getFieldDecorator('remark', {initialValue: remark})(
                      <Input.TextArea style={{width: 600}} rows={3} placeholder="接口描述"></Input.TextArea>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Modal onOk={this.modelOk} onCancel={this.hideModel} cancelText="取消" okText="确定" visible={this.state.showJsonModel} title='JSON 数据'>
                {getFieldDecorator('json', {initialValue: this.jsonData})(<Input.TextArea rows={10} placeholder="JOSN 数据"></Input.TextArea>)}
            </Modal>
            <Divider></Divider>
            {getFieldDecorator('response_result', {initialValue: this.state.response})(
              <Input.TextArea style={{width: '100%'}} rows={10} placeholder="Result"></Input.TextArea>
            )}
            <div style={{marginTop: 20}} className="text-c">
              <Button type="primary" onClick={this.saveToTemplate}>保存结果到模版</Button>
            </div>
        </Form>
      </div>
    );
  }
}


export default  Form.create()(APIEdit)