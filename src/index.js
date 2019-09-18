import * as React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/common.scss';
import Route from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN.js';
// import * as serviceWorker from './serviceWorker';
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
     <Route />
  </ConfigProvider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
