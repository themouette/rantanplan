/* @flow */
import React, { Component } from 'react';

import './Header.css';
import logo from '../assets/rantanplan-250.png';


type Props = {};

/**
 * Header component
 */
class Header extends Component<Props> {
  static defaultProps = {};

  render() {
    return (
      <header className="App-Header">
        <img src={logo} className="App-Logo" alt="Rantanplan" />
        <div className="App-Title">
          <h1 className="App-Title-Content">
            Rantanplan
          </h1>
          <h2 className="App-Title-Subtitle">
            Modern Monitoring & Analytics (For Localhost)
          </h2>
        </div>
      </header>
    );
  }
}

export default Header;
