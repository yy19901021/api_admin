import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './index.scss'
export interface ISubSliderProps {
  title: string
  to: string
}

class SubSlider extends React.Component<ISubSliderProps> {
  public render() {
    const {to, title} = this.props
    return (
      <div className="slider-sub-title">
          <NavLink className="slider-title" activeClassName="slider-title-active" to={to} >{title}</NavLink>
      </div>
    );
  }
}

export interface ISliderProps {
  title: string
  to?: string
  subs?: ISubSliderProps[]
  project_id?: string
  onClick?: (id: string) => void
}

export default class Slider extends React.Component<ISliderProps> {
  public render() {
    const {to, title, subs} = this.props
    return (
      <div className="silder">
        {to ? <NavLink exact className="slider-title" activeClassName="slider-title-active" to={to} >{title}</NavLink> : <div className="slider-title">{title}</div>}
        {subs && subs.map((item: any) => (<SubSlider onClick={() => {this.props.onClick && this.props.onClick(item.model_id)}} key={item.model_id} to={{pathname: '/projectDetail/'+ this.props.project_id +'/model/' + item.model_id, state: item.model_id}} {...item}></SubSlider>))}
      </div>
    );
  }
}
