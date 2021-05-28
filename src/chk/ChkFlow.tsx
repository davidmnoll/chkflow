import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 
import ChkFlowBase from './ChkFlowBase'
// import TreeNode from './TreeNode'
import DefaultTreeNode from './DefaultTreeNode'
import DefaultTreeHead from './DefaultTreeHead'
import DefaultTreeTailDisplay from './DefaultTreeTailDisplay'
import DefaultTreeTailEdit from './DefaultTreeTailEdit'


/**
 * This is a facade component with all properties options
 * to make sure everything required is passed to ChkFlowBase 
 * using defaults as necessary
 */

const ChkFlow: React.FC<Partial<Types.ChkFlowProps>> =  function (props: Partial<Types.ChkFlowProps>) {

  const l1 = {
    '0' : { text: 'blah0', children: ['1', '3'], isCollapsed: false },
    '1' : { text: 'blah1', children: ['5', '2'], isCollapsed: false  },
    '2' : { text: 'blah2', children: ['4'], isCollapsed: false  },
    '3' : { text: 'blah3', children: [], isCollapsed: false  },
    '4' : { text: 'blah4', children: [], isCollapsed: false  },
    '5' : { text: 'blah5', children: ['6', '7'], isCollapsed: false  },
    '6' : { text: 'blah6', children: [], isCollapsed: false  },
    '7' : { text: 'blah7', children: [], isCollapsed: false  },
  }

  let environment = {
    rootPath: ['0', '1', '5'],
    ...props.state
  }

  let settings = {
    treeNodeComponent: DefaultTreeNode,
    treeHeadComponent: DefaultTreeHead,
    treeTailDisplayComponent: DefaultTreeTailDisplay,
    treeTailEditComponent: DefaultTreeTailEdit,
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