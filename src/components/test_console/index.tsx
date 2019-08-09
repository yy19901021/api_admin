import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { Tag, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import { removeLog, REMOVELOGALL } from '../../redux/actions';

export interface Log{
  type: string
  api_content?: string
  message?: string
  api_id?: string
  model_id?: string
  project_id?: string
  time: string
}


export interface ILogItemProps extends Log {
  index: number
  onClose: () => void
}
const tags:any = {
  success: (<Tag  color='#0f0'>success</Tag>),
  error: (<Tag color='#f00'>error</Tag>),
  warn: (<Tag color='#ded91a'>warn</Tag>)
}
const colors:any = {
  success: '#0f0',
  error: '#f00',
  warn:'#ded91a'
}
class LogItem extends React.Component<ILogItemProps> {
  public render() {
    console.log(this.props)
    return (
      <div className='log-item' style={{color: colors[this.props.type]}}>
        {tags[this.props.type]}
        {/* {<Link to={}></Link>} */}
        <Link to={`/projectDetail/${this.props.project_id}/model/${this.props.model_id}/api/${this.props.api_id}`} style={{paddingRight:5,color: colors[this.props.type], textDecoration: 'underline'}}>{this.props.api_content}:</Link>
        <span className="flex-1">{this.props.message}</span>
        <span style={{margin: '0 10px'}}>{this.props.time}</span>
        <Icon type="close-circle" onClick={this.props.onClose}/>
      </div>
    );
  }
}


export interface ITestConsoleProps {
  logs:any
  clear: () => void
  removeLog: (index: number) => void
  onClose: () => void
  onReset?: () => void
}

export interface ITestConsoleStates {
  logX: number,
  logY: number,
}

class TestConsole extends React.Component<ITestConsoleProps, ITestConsoleStates> {
  startX: number
  startY: number
  startDrag: boolean
  constructor(props:ITestConsoleProps) {
    super(props)
    this.startX = 0
    this.startY = 0
    this.startDrag = false
    this.state = {
      logX: 0,
      logY: 0
    }
  }
  handlerClose = (index: number) => {
    return () => {
      this.props.removeLog(index)
      console.log(this.props.logs)
    }
  }
  handlerDrag = (e: any) => {
    e.stopPropagation()
    if (this.startDrag) {
      return 
    } else {
      this.startDrag = true
      this.startX = e.clientX
      this.startY = e.clientY
    }
  }
  handlerDragEnd = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      logX: e.clientX - this.startX,
      logY: e.clientY - this.startY
    })
  }
  public render() {
    return (
      <ul className='log-container' style={{transform: `translate(${this.state.logX}px, ${this.state.logY}px)`}} draggable onDragStart={this.handlerDrag} onDragEnd={this.handlerDragEnd}>
        <li className='log-header flex-c' >
          <Icon type="code"  />
          <span style={{paddingLeft: 6}} className="flex-1">测试日志</span>
          {!this.props.logs.loading ? <Button icon="redo" type="link" size="large" onClick={this.props.clear}></Button> :
          <Button icon="loading" type="link" size="large"></Button> }
          <Button icon="close-circle" type="link" size="large" onClick={this.props.onClose}></Button> 
        </li>
        <li className="log-content">
          {this.props.logs.lists.map((item: any, index: number) => {
            return <LogItem key={index} {...item} index={index}  onClose={this.handlerClose(index)}></LogItem>
          })}
        </li>
      </ul>
    );
  }
}

export default connect((state: any) => {
  return {
    logs: state.logs,
  }
}, (dispatch) => ({
  removeLog: (index: number) => {dispatch(removeLog(index))},
  clear: () => {dispatch(removeLog(1, REMOVELOGALL))}
}))(TestConsole)