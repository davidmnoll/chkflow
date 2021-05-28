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

  collapse(){
    this.setState({isCollapsed: true});
  }
  expand(){
    this.setState({isCollapsed: false});
  }

  toggle(){
    this.state.isCollapsed ? this.expand() : this.collapse() 
  }

  startEdit(){
    this.setState({editMode: true});
  }
  saveEdit(nodeInfo: T){
    //TODO: store node data
    this.props.updateNode(this.state.id, nodeInfo)
    this.setState({editMode: false});
  }
  cancelEdit(){
    this.setState({editMode: false});
  }
  
  render() {
    const TreeNodeDisplay = this.props.render as React.ElementType

    return (
      <TreeNodeDisplay 
        settings={this.props.settings}
        nodeInfo={this.props.nodeInfo}
        nodePath={this.props.nodePath}
        isCollapsed={this.state.isCollapsed}
        editMode={this.state.editMode}
        treeHead={this.props.settings.treeHeadComponent}
        treeTailDisplay={this.props.settings.treeTailDisplayComponent}
        treeTailEdit={this.props.settings.treeTailEditComponent}
        collapse={this.collapse.bind(this)}
        expand={this.expand.bind(this)}
        toggle={this.toggle.bind(this)}
        startEdit={this.startEdit.bind(this)}
        saveEdit={this.saveEdit.bind(this)}
        cancelEdit={this.cancelEdit.bind(this)} 
        setPath={this.props.setPath}
        >
          {this.props.children}
        </TreeNodeDisplay>

    )  
  }
}




export default TreeNode