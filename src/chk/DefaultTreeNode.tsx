
import React from 'react'
import * as Types from './types' 
import TreeNode from './TreeNode'

const DefaultTreeNode: React.FC<Types.DefaultTreeNodeProps>  = function(props){ 
    
  const TreeHead = props.settings.treeHeadComponent as React.ElementType
  const TreeTailEdit = props.settings.treeTailEditComponent as React.ElementType
  const TreeTailDisplay = props.settings.treeTailDisplayComponent as React.ElementType

  return (
    <div className="node-container">
      <div className="node-main">
        <TreeHead 
          isCollapsed={props.isCollapsed} 
          collapse={props.collapse} 
          toggle={props.toggle} 
          setPath={props.setPath} 
          nodeInfo={props.nodeInfo} 
          nodePath={props.nodePath}
          />
        {props.editMode 
        ? (<TreeTailEdit nodeInfo={props.nodeInfo} saveEdit={props.saveEdit} cancelEdit={props.cancelEdit} />)
        : (<TreeTailDisplay nodeInfo={props.nodeInfo}  startEdit={props.startEdit}/>)
        }
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