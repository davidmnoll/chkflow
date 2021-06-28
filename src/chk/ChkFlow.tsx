import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 
import ChkFlowBase from './ChkFlowBase'
// import TreeNode from './TreeNode'
import DefaultTreeNode from './DefaultTreeNode'
import DefaultTreeHead from './DefaultTreeHead'
import DefaultTreeTail from './DefaultTreeTail'


/**
 * This is a facade component with all properties options
 * to make sure everything required is passed to ChkFlowBase 
 * using defaults as necessary
 */

 const dummyNodes = {
  '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1','3']}, isCollapsed: false },
  '1' : { text: 'blah1', rel: {'child': ['5', '2']}, isCollapsed: false  },
  '2' : { text: 'blah2', rel: {'child': ['4']}, isCollapsed: false  },
  '3' : { text: 'blah3', rel: {'child': []}, isCollapsed: false  },
  '4' : { text: 'blah4', rel: {'child': []}, isCollapsed: false  },
  '5' : { text: 'blah5', rel: {'child': ['6','7']}, isCollapsed: false  },
  '6' : { text: 'blah6', rel: {'child': []}, isCollapsed: false  },
  '7' : { text: 'blah7', rel: {'child': []}, isCollapsed: false  },
}
const dummyEnvironment = {
  rootPath: ['0', '1', '5'],
  rel: 'child',
  homeNode: ['0'],
  activeNode: [],
}
const dummySettings = {

}
 function setDummyData(){

  window.localStorage.setItem('chkFlowNodes', JSON.stringify(dummyNodes))
  window.localStorage.setItem('chkFlowEnvironment', JSON.stringify(dummyEnvironment))
  window.localStorage.setItem('chkFlowSettings', JSON.stringify(dummySettings))
}

const ChkFlow: React.FC<Partial<Types.ChkFlowProps>> =  function (props: Partial<Types.ChkFlowProps>) {

  let environment = {
    ...props.state,
  }
  let nodes = {
    ...props.nodes
  }

  let settings = {
    treeNodeComponent: DefaultTreeNode,
    treeHeadComponent: DefaultTreeHead,
    treeTailComponent: DefaultTreeTail,
    defaultEnvironment: dummyEnvironment,
    defaultNodes: dummyNodes,
    ...props.settings
  }

  console.log(settings)
  let savedNodes = window.localStorage.getItem('chkFlowNodes')
  let savedEnv = window.localStorage.getItem('chkFlowEnvironment')
  // let savedSettings = window.localStorage.getItem('chkFlowSettings')

  if (savedNodes) {
    console.log('retrieved nodes')
    nodes = {
      ...nodes,
      ...JSON.parse(savedNodes)
    }
  }
  if (savedEnv){
    console.log('retrieved environment')
    environment = {
      ...environment,
      ...JSON.parse(savedEnv)
    }
  }
  if (!savedNodes && !savedEnv){
    setDummyData()
  }


  return (
    <div className="chkflow-container">
      <ChkFlowBase 
        settings={settings} 
        nodes={nodes} 
        environment={environment} 
      />
    </div>
  );
}


// class ChkFlow extends ChkFlowBase { 
// }


export { Types, ChkFlow }
export default ChkFlow