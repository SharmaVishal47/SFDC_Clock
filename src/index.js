import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {initializeGlobalState} from "./store/store";

initializeGlobalState();

ReactDOM.render(<App />, document.getElementById('root'));
