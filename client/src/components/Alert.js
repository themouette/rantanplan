/* @flow */
import React, { Component, type Node } from 'react';

import './Alert.css';


type Props = {
  children: Node,
  type: 'error' | 'warning' | 'success';
};

/**
 * Alert component
 */
class Alert extends Component<Props> {
  static defaultProps = {
    type: 'success',
  };

  getClassName() {
    return `Alert Alert-${this.props.type.toLowerCase()}`;
  }

  render() {
    return (
      <div className={this.getClassName()}>
        {this.props.children}
      </div>
    );
  }
}

export default Alert;
