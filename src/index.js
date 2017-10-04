import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let root;
if(window.doneSsrAttach) {
  root = document.createElement('div');
  root.id = 'root';
  window.doneSsrAttach(root);
} else {
  root = document.getElementById('root');
}

ReactDOM.render(<App />, root);
