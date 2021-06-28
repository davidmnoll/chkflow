
import React from 'react'
import * as Types from './types' 
import TreeNode from './TreeNode'
import * as R from 'ramda'

const DefaultTreeNode: React.FC<Types.DefaultTreeNodeProps>  = function(props){ 
    
  const TreeHead = props.settings.treeHeadComponent as React.ElementType
  const TreeTail = props.settings.treeTailComponent as React.ElementType

  // console.log('activeComp',props.activeNode, props.nodePath, (R.equals(props.activeNode, props.nodePath)))
  const hasChildren = !(props.isCollapsed || !props.children || !(props.children.length > 0))
  // console.log('active? ', props.activeNode, props.nodePath, R.equals(props.activeNode, props.nodePath))
  return (
    <div className="node-container" id={props.nodePath[props.nodePath.length - 1]}>
      <div 
        className={ (R.equals(props.activeNode, props.nodePath)) ? "node-main active" :  "node-main"}
        onFocusCapture={() => {props.setActiveNode(props.nodePath)}}
        >
        <TreeHead 
          isCollapsed={props.isCollapsed}
          collapse={props.collapse} 
          toggle={props.toggle} 
          setPath={props.setPath} 
          nodeInfo={props.nodeInfo} 
          nodePath={props.nodePath}
          newChild={props.newChild}
          hasChildren={props.children.length > 0}
          moveChildFromPath={props.moveChildFromPath}
          moveUnderPreviousNode={props.moveUnderPreviousNode}
          />
        <TreeTail
          editMode={props.editMode}
          nodePath={props.nodePath} 
          moveUnderParent={props.moveUnderParent}
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
      <div className={hasChildren ? "node-children" : "node-children hidden"} >
        {  hasChildren ? props.children : ''}
      </div>
    </div>
  )  
    
}

export default DefaultTreeNode