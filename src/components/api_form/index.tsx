
import * as React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

export interface Form_Item{
  lable: string
  rules?: any[]
  key: string
  sheet: React.ReactNode
  init_value? : any
}

export interface IApiFormProps extends FormComponentProps {
  form_list: Form_Item[]
  labelCol?: number
  layout?: 'horizontal'|'vertical'|'inline'
  className?: string
  styles?: React.CSSProperties
}
class ApiForm extends React.Component<IApiFormProps> {
  public render() {
    const labelCol = this.props.labelCol ?  this.props.labelCol : 6
    const formItemLayout = {
      labelCol: { span: labelCol},
      wrapperCol: {span: 24 - labelCol},
    };
    const {getFieldDecorator} = this.props.form
    return (
      <div style={this.props.styles} className={this.props.className}>
        <Form {...formItemLayout} layout={this.props.layout} >
          {this.props.form_list.map(item => {
            return <div key={item.key}><Form.Item label={item.lable}>{getFieldDecorator(item.key, {rules: item.rules, initialValue: !item.init_value ? null : typeof item.init_value === 'string' ||  Array.isArray(item.init_value)? item.init_value : item.init_value[item.key]})(item.sheet)}</Form.Item></div>
          })}
          {this.props.children}
        </Form>
      </div>
    );
  }
}

export default ApiForm
