import * as React from 'react'
import './style.scss'
import * as Types from './types' 

class TreeNode<T extends Types.BaseNodeInfo> extends React.Component<Types.TreeNodeProps<T>, Types.TreeNodeState<T>> implements Types.TreeNodeInterface{ 

  constructor(props: Types.TreeNodeProps<T>){
    super(props);
    this.state = {
      id: props.nodePath[props.nodePath.length - 1],
      data: props.nodeInfo,
      editMode: false,
      isCollapsed: props.nodeInfo.isCollapsed
    }
  }
  
  getNodeInfo(id: Types.NodeId): any{
    return {}
  }

  // collapse(){
  //   this.setState({isCollapsed: true});
  // }
  // expand(){
  //   this.setState({isCollapsed: false});
  // }



  startEdit(){
    this.setState({editMode: true});
  }
  saveEdit(nodeInfo: T){
    //TODO: store node data
    this.props.updateNode(this.props.nodePath, nodeInfo)
    this.setState({editMode: false});
  }
  cancelEdit(){
    this.setState({editMode: false});
  }
  
  render() {
    const TreeNodeDisplay = this.props.render as React.ElementType
    // console.log('nodePath',this.props.nodePath, this.props.activeNode)
    return (
      <TreeNodeDisplay 
        getRelation={this.props.getRelation}
        setRelation={this.props.setRelation}
        settings={this.props.settings}
        nodeInfo={this.props.nodeInfo}
        nodePath={this.props.nodePath}
        isCollapsed={this.props.nodeInfo.isCollapsed}
        editMode={this.state.editMode}
        treeHead={this.props.settings.treeHeadComponent}
        treeTail={this.props.settings.treeTailComponent}
        // collapse={this.collapse.bind(this)}
        // expand={this.expand.bind(this)}
        toggle={this.props.toggleCollapse}
        startEdit={this.startEdit.bind(this)}
        saveEdit={this.saveEdit.bind(this)}
        activeNode={this.props.activeNode}
        setActiveNode={this.props.setActiveNode.bind(this)}
        cancelEdit={this.cancelEdit.bind(this)} 
        setPath={this.props.setPath}
        newChild={this.props.newChild}
        moveUnderParent={this.props.moveUnderParent}
        moveCursorToVisuallyNextNode={this.props.moveCursorToVisuallyNextNode}
        moveCursorToVisuallyPreviousNode={this.props.moveCursorToVisuallyPreviousNode}
        newChildUnderThisNode={this.props.newChildUnderThisNode}
        moveChildFromPath={this.props.moveChildFromPath}
        moveUnderPreviousNode={this.props.moveUnderPreviousNode}
        >
          {this.props.children}
        </TreeNodeDisplay>

    )  
  }
}




export default TreeNode