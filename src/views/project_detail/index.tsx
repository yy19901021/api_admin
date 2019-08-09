import * as React from 'react';
import './index.scss'
import { RouteComponentProps, withRouter } from 'react-router';
import { MyRouter } from '../../router';
import MainLayout from '../../components/layout';
import ApiSlider from '../../components/api_slider';
import Requests from '../../api';
import DetailContent from '../project_detail_content';
import { connect } from 'react-redux';
import { getModels } from '../../redux/actions';
import DetailModel from '../model_detail';
import APIEdit from '../api_edit'
interface IDetailProps extends RouteComponentProps<{project_id: string}> {
  models: any[]
  initModels: (data: any) => void
}
interface IDetailStates  {
  collapsed: boolean
}

class Detail extends React.Component<IDetailProps , IDetailStates> {
  project_id: string
  constructor(props: IDetailProps) {
    super(props)
    this.state = {
      collapsed: false,
    }
    this.project_id = this.props.match.params.project_id
  }
  getDetail() {
    Requests.queryProjectWithModels(this.project_id).then(({data}) => {
      if (data) {
        this.props.initModels(data)
      }
    })
  }
  componentDidMount() {
    this.getDetail()
  }
  public render() {
    const menus = (
      <div className="detail-silder">
        <ApiSlider to={'/projectDetail/' + this.project_id} title='项目详情'></ApiSlider>
        {this.props.models.length > 0 && <ApiSlider project_id={this.project_id} subs={this.props.models} title='项目模块'></ApiSlider>}
      </div>
    );
    return (
        <MainLayout silder={menus} onCollapsed = {(val) => {this.setState({collapsed: val})}}>
          <MyRouter exact path="/projectDetail/:project_id"  component={DetailContent} ></MyRouter>
          <MyRouter exact path="/projectDetail/:project_id/model/:model_id" component={DetailModel} ></MyRouter>
          <MyRouter exact path="/projectDetail/:project_id/model/:model_id/api/:api_id" component={APIEdit} ></MyRouter>
        </MainLayout>
    );
  }
}
export default connect((state: any) => ({
  models: state.models
}), (dispatch) => ({
  initModels: (data: any) =>{ dispatch(getModels(data))}
}))(withRouter<IDetailProps & RouteComponentProps, any>(Detail))