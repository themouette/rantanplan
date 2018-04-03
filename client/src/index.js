/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element to mount application');
}

ReactDOM.render(<App interval={1000} />, root);
registerServiceWorker();
