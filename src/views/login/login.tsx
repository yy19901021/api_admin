import * as React from 'react';
import './index.scss';
import { Input, Form, Icon, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import Requests from '../../api';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions';

export interface ILoginProps extends FormComponentProps {
  username: string,
  password: string,
  dispatch: any
}
export interface ILoginStates {
  src: any,
}
class Login extends React.Component<ILoginProps & RouteComponentProps, ILoginStates> {
  readonly state: ILoginStates
  constructor(props: ILoginProps & RouteComponentProps) {
    super(props)
    this.state = {
      src: ''
    }
  }
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        Requests.login(values).then((data) => {
          if (data.code === 200) {
            notification.success({
              message: '登录成功！'
            })
            const {dispatch} = this.props
            sessionStorage.setItem('userInfor', JSON.stringify(data.data))
            dispatch(getUser(data.data))
            this.props.history.push('/')
          }
        })
      }
    });
  }
  getCode = () => {
    Requests.getCode().then(({data}) => {
      this.setState({
        src: data
      })
    })
  }
  componentDidMount() {
    this.getCode()
  }
  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户账号!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户账号: （预览账号：preview）"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入用户密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="用户密码 （预览密码： preview123456）"
              />,
            )}
          </Form.Item>
          <div className="flex-c">
          {getFieldDecorator('code', {
              rules: [{ required: true, message: '请输入验证码!' }],
            })(
              <Input
                prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="验证码"
              />,
            )}
            <div className="login-code"  dangerouslySetInnerHTML={{__html: this.state.src}}></div>
            <Button className="login-change-code"  size="small" onClick={this.getCode} type="link">换一张</Button>
          </div>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="">
                Forgot password
              </a> */}
            
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
              </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
    );
  }
}

export default Form.create({ name: 'login' })(withRouter(connect()(Login)))