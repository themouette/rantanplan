/* @flow */
import React, { Component } from 'react';
import 'normalize.css/normalize.css';
import './App.css';
import createStore, { type Store, type State as StoreState } from './store';
import Dashboard from './components/Dashboard';


type Props = {
  interval: number,
};
type State = StoreState;

class App extends Component<Props, State> {
  store: Store;
  timer: ?TimeoutID;

  constructor() {
    super();
    this.store = createStore(this);
    this.state = this.store.getInitialState();
  }

  fetchAndSchedule = () => {
    this.store.fetchData();
    this.timer = setTimeout(
      () => { this.fetchAndSchedule(); },
      this.props.interval
    );
  }

  startPoller = () => {
    if (this.timer) return false;
    return this.fetchAndSchedule();
  }

  stopPoller = () => {
    if (!this.timer) return undefined;

    clearTimeout(this.timer);
    this.timer = undefined;
  }

  componentDidMount() {
    this.startPoller();
  }

  componentWillUnmount() {
    this.stopPoller();
  }

  render() {
    return (
      <Dashboard {...this.state} />
    );
  }
}

export default App;
