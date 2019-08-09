import logo from './logo.svg';
import './App.css';

import * as React from 'react';
import { connect, MapStateToProps} from 'react-redux';

export interface IAppProps {
  
}

type stateProps = {
  count: number
}
type TOwnProps = {}
type inputProps = {
  count: number
}
const mapToState: MapStateToProps<stateProps, TOwnProps, inputProps> = (state) => {
  return {
    count: state.count
  }
}
class App extends React.Component<IAppProps & stateProps & {dispatch: any}> {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
export default connect(mapToState)(App)
