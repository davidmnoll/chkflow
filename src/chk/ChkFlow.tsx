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
    '0' : { text: 'blah0', rel: {'1': 'child','3':'child'}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'5': 'child','2':'child'}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'4':'child'}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'6': 'child', '7': 'child'}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {}, isCollapsed: false  },
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