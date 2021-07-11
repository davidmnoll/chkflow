import './App.css';
import ChkFlow from './chk';
import type {
  ChkFlowEnvironment,
  ChkFlowNodes,
  ChkFlowSettings,
  ChkFlowState,
  ChkFlowNode
} from './chk'

function getNodes(): ChkFlowNodes | undefined{
  let savedNodes = window.localStorage.getItem('chkFlowNodes')

  if (savedNodes) {
    console.log('retrieved nodes')
    let nodes = JSON.parse(savedNodes)
    return nodes;
  }

}

function getEnv(): ChkFlowEnvironment | undefined{
  let savedEnv = window.localStorage.getItem('chkFlowEnvironment')
  if (savedEnv){
    console.log('retrieved environment')
    let environment = JSON.parse(savedEnv);
    return environment
  }
}


function setStateCallback(state: ChkFlowState): void{
  window.localStorage.setItem('chkFlowEnvironment', JSON.stringify(state.environment));
  window.localStorage.setItem('chkFlowNodes', JSON.stringify(state.nodes));
}

function App() {

  

  const nodes = getNodes();
  const environment = getEnv();
  const settings: ChkFlowSettings = {
    setStateCallback: setStateCallback,
    nodes: nodes as ChkFlowNodes,
    environment: environment as ChkFlowEnvironment
  }  



  return (
    <div className="App">
      <ChkFlow {...settings} />
    </div>
  );
}

export default App;
