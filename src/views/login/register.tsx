import * as React from 'react';
import './index.scss';
import { Input, Form, Icon, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import Requests from '../../api';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions';

export interface ILoginProps extends FormComponentProps {
  dispatch: any
}

class Register extends React.Component<ILoginProps & RouteComponentProps> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        Requests.register(values).then((data) => {
          if (data.code === 200) {
            notification.success({
              message: '注册成功'
            })
            this.props.dispatch(getUser(data.data))
            this.props.history.push('/')
          }
        })
      }
    });
  }
  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <Form onSubmit={this.handleSubmit} className="login-form" >
          <Form.Item>
            {getFieldDecorator('pet_name', {
              rules: [{ required: true, message: '请输入用户昵称!' }, {min: 2, max: 6,message: "用户昵称数不能小于2位大于6位"}],
            })(
              <Input
                prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户昵称"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户账号!' }, {min: 2, max: 10,message: "用户账号数不能小于2位大于10位"}, {pattern: /^[0-9a-zA-Z_]+$/g, message: '账号只能包含数字字母和下划线(_)'}],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户账号"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{message: '请输入正确的邮箱格式!', pattern: /[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/ }],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="邮箱地址"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入用户密码!' }, { min: 6, max: 20,message: '密码长度不能小于6位大于20位!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="用户密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password2', {
              rules: [{ required: true, message: '请再次输入用户密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="再次输入用户密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="">
                Forgot password
              </a> */}
            <Button type="primary" htmlType="submit" className="login-form-button">
              注册
              </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
    );
  }
}

export default Form.create({ name: 'register' })(connect()(withRouter(Register)))