import './App.css';
import {Types as chkTypes, ChkFlow } from './chk/ChkFlow';

import DefaultTreeNode from './chk/DefaultTreeNode'
import DefaultContainer from './chk/DefaultContainer'

interface MyNodeInfo {
  text: string,
  isCollapsed: boolean
}

interface MyEnvironment {
  showDummies: boolean,
}



function getNodes(): chkTypes.ChkFlowNodes | undefined{
  let savedNodes = window.localStorage.getItem('chkFlowNodes')
  // let savedSettings = window.localStorage.getItem('chkFlowSettings')

  if (savedNodes) {
    console.log('retrieved nodes')
    let nodes = JSON.parse(savedNodes)
    return nodes;
  }

}

function getEnv(): chkTypes.ChkFlowEnvironment | undefined{
  let savedEnv = window.localStorage.getItem('chkFlowEnvironment')
  if (savedEnv){
    console.log('retrieved environment')
    let environment = JSON.parse(savedEnv);
    return environment
  }
}


function setStateCallback(state: chkTypes.ChkFlowState): void{
  window.localStorage.setItem('chkFlowEnvironment', JSON.stringify(state.environment));
  window.localStorage.setItem('chkFlowNodes', JSON.stringify(state.nodes));
  // window.localStorage.setItem('chkFlowOptions', JSON.stringify(this.state.options));
}

function App() {

  const dummyNodes = {
    '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1','3']}, isCollapsed: false },
    '1' : { text: 'chores', rel: {'child': ['5', '2']}, isCollapsed: false  },
    '2' : { text: 'clean', rel: {'child': ['4']}, isCollapsed: false  },
    '3' : { text: 'study', rel: {'child': []}, isCollapsed: false  },
    '4' : { text: 'bathroom', rel: {'child': []}, isCollapsed: false  },
    '5' : { text: 'groceries', rel: {'child': ['6','7']}, isCollapsed: true  },
    '6' : { text: 'This is coming from App.tsx', rel: {'child': []}, isCollapsed: false  },
    '7' : { text: 'eggs', rel: {'child': []}, isCollapsed: false  },
  }
  const dummyEnvironment = {
    homePath: [{id:'0', rel:'root'}, {id:'1', rel: 'child'}] as chkTypes.NodePath,
    activeNode: null,
  }

  const nodes = getNodes() || dummyNodes;
  const environment = getEnv() || dummyEnvironment;
  const settings: chkTypes.ChkFlowState = {
    showDummies: false,
    setStateCallback: setStateCallback,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    defaultEnvironment: dummyEnvironment,
    defaultNodes: dummyNodes,
    nodes: nodes as chkTypes.ChkFlowNodes,
    environment: environment as chkTypes.ChkFlowEnvironment
  }  



  return (
    <div className="App">
      <ChkFlow {...settings} />
    </div>
  );
}

export default App;
