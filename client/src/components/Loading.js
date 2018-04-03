/* @flow */
import React, { Component } from 'react';
import './Loading.css';


type Props = {
	color: string,
};

/**
 * Loading component
 */
class Loading extends Component<Props> {
  static defaultProps = {
    color: '#f68f6f',
  };

  render() {
    return (
			<div style={{ color: this.props.color }} className="la-pacman la-3x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}

export default Loading;
