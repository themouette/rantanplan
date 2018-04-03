/* @flow */
import React, { Component } from 'react';

import logo from '../assets/rantanplan-250.png';


type Props = {};

/**
 * Header component
 */
class Header extends Component<Props> {
  static defaultProps = {};

  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Rantanplan" />
        <h1 className="App-title">
          Rantanplan, Modern Monitoring & Analytics (For Localhost)
        </h1>
      </header>
    );
  }
}

export default Header;
