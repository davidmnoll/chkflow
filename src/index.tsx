import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DefaultApp from './chk/default/App';
import ExecApp from './chk/exec/App';
import ChkFlow from "./chk"





ReactDOM.render(
  <React.StrictMode>
    <ExecApp />
  </React.StrictMode>,
  document.getElementById('root')
);



export { default as ChkFlow } from "./chk"
export default ChkFlow
export type {
    ChkFlowSettings,
    ChkFlowNode,
    ChkFlowState,
    ChkFlowEnvironment,
    ChkFlowNodes
} from "./chk"