
import React from 'react'
import * as Types from './types' 
import TreeNode from './TreeNode'
import { eqProps } from 'ramda'

const DefaultTreeNode: React.FC<Types.DefaultTreeNodeProps>  = function(props){ 
    
  const TreeHead = props.settings.treeHeadComponent as React.ElementType
  const TreeTail = props.settings.treeTailComponent as React.ElementType

  return (
    <div className="node-container" id={props.nodePath[props.nodePath.length - 1]}>
      <div className="node-main">
        <TreeHead 
          isCollapsed={props.isCollapsed}
          collapse={props.collapse} 
          toggle={props.toggle} 
          setPath={props.setPath} 
          nodeInfo={props.nodeInfo} 
          nodePath={props.nodePath}
          newChild={props.newChild}
          moveChildFromPath={props.moveChildFromPath}
          moveUnderPreviousNode={props.moveUnderPreviousNode}
          />
        <TreeTail
          editMode={props.editMode}
          nodePath={props.nodePath} 
          nodeInfo={props.nodeInfo} 
          saveEdit={props.saveEdit} 
          cancelEdit={props.cancelEdit} 
          getRelation={props.getRelation} 
          newChild={props.newChild} 
          moveCursorToVisuallyNextNode={props.moveCursorToVisuallyNextNode}
          moveCursorToVisuallyPreviousNode={props.moveCursorToVisuallyPreviousNode}
          newChildUnderThisNode={props.newChildUnderThisNode} 
          moveUnderPreviousNode={props.moveUnderPreviousNode} 
          />
      </div>
      {props.isCollapsed || !props.children || !(props.children.length > 0) ?
        ('')
        : (<div className="node-children">
        {props.children}
      </div>)
      }
    </div>
  )  
    
}

export default DefaultTreeNode