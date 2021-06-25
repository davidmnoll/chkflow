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

const ChkFlow: React.FC<Partial<Types.ChkFlowProps>> =  function (props: Partial<Types.ChkFlowProps>) {

  const l1 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5', '2']}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, isCollapsed: false  },
  }

  let environment = {
    rootPath: ['0', '1', '5'],
    // rel: 'children',
    homeNode: ['0'],
    ...props.state
  }

  let settings = {
    treeNodeComponent: DefaultTreeNode,
    treeHeadComponent: DefaultTreeHead,
    treeTailComponent: DefaultTreeTail,
    ...props.settings
  }

  let nodes = {
    ...l1,
    ...props.nodes
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