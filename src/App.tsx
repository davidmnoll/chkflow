import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Types as chkTypes, ChkFlow } from './chk/ChkFlow';



function App() {

  const settings : chkTypes.ChkFlowProps = {
  
  }
   


  return (
    <div className="App">
      <ChkFlow />
    </div>
  );
}

export default App;
