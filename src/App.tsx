import './App.css';
import {Types as chkTypes, ChkFlow } from './chk/ChkFlow';

import DefaultTreeNode from './chk/DefaultTreeNode'


interface MyNodeInfo {
  text: string,
  isCollapsed: boolean
}

interface MyEnvironment {
  showDummies: boolean,
}



function getNodes(): chkTypes.ChkFlowState<MyNodeInfo, MyEnvironment>{
  let savedNodes = window.localStorage.getItem('chkFlowNodes')
  let savedEnv = window.localStorage.getItem('chkFlowEnvironment')
  // let savedSettings = window.localStorage.getItem('chkFlowSettings')

  if (savedNodes) {
    console.log('retrieved nodes')
    let nodes = JSON.parse(savedNodes)
  }
  if (savedEnv){
    console.log('retrieved environment')
    let environment = JSON.parse(savedEnv)
  }
}


function setStateCallback(state: chkTypes.ChkFlowState<MyNodeInfo, MyEnvironment>): void{
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
    '5' : { text: 'groceries', rel: {'child': ['6','7']}, isCollapsed: false  },
    '6' : { text: 'This is coming from App.tsx', rel: {'child': []}, isCollapsed: false  },
    '7' : { text: 'eggs', rel: {'child': []}, isCollapsed: false  },
  }
  const dummyEnvironment = {
    homePath: ['0', '1'],
    activeNode: [],
  }

  const nodes = getNodes();
  const settings: chkTypes.ChkSettings = {
    showDummies: false,
    setStateCallback: setStateCallback,
    nodeComponent: DefaultTreeNode,
    defaultEnvironment: dummyEnvironment,
    defaultNodes: dummyNodes,
    nodes: nodes,
  }  



  return (
    <div className="App">
      <ChkFlow<MyNodeInfo, MyEnvironment> {...settings} />
    </div>
  );
}

export default App;
