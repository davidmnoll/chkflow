import * as React from 'react'
import './style.scss'
import * as Types from './types' 
import Header from './Header'
import TreeNode from './TreeNode'


//Todo: make generic & use generics for storing info etc.
class ChkFlowBase extends React.Component<Types.ChkFlowBaseProps, Types.ChkFlowState> { 
  

  constructor(props: Types.ChkFlowBaseProps){
    super(props)
    this.state = {...this.state, environment: props.environment, nodes: props.nodes, settings: props.settings }
  }  

  getNodeInfo(id: Types.NodeId): any {

    return this.state.nodes[id]
  }

  updateNode(id: Types.NodeId, data: any ){
    this.setState({...this.state, nodes: {...this.state.nodes, [id]: { ...this.state.nodes[id], ...data } }})
  }
  
  setPath(path: Types.NodeId[]){
    this.setState({...this.state, environment: {...this.state.environment, rootPath: path }})
  }

  getRelation(path: Types.NodeId[]){
    var rel: Types.NodeId = 'child';
    if (path.length == 1){
      rel = "root";
    }else{
      Object.keys(this.state.nodes[path[path.length-2]].rel).forEach((key:Types.NodeId, index:number)=>{
        if (this.state.nodes[path[path.length-2]][key] == this.state.nodes[path[path.length-1]]){
          rel = key;
          console.log('key', key, index, this.state.nodes[path[path.length-2]].rel, this.state.nodes[path[path.length-1]])
        }
      })
      console.log('rel', rel)
    }
    return rel;
  }
  setRelation(path: Types.NodeId[], relation: Types.NodeId){
    this.setState({...this.state, 
      nodes: {
        ...this.state.nodes, 
        [path[path.length-2]]: {
          ...this.state.nodes[path[path.length-2]], 
          rel: {
            ...this.state.nodes[path[path.length-2]].rel, 
            [path[path.length-1]] : relation 
          }
        }
      }
    })
  }

  getComponentTree(id: Types.NodeId) {
    return ( 
      Object.keys(this.state.nodes[id].rel).length > 0 ? 
        (<TreeNode
          key={id}
          nodePath={[...this.state.environment.rootPath, id]} 
          nodeInfo={this.getNodeInfo(id)} 
          settings={this.state.settings} 
          render={this.state.settings.treeNodeComponent}
          setPath={this.setPath.bind(this)}
          getRelation={this.getRelation.bind(this)}
          setRelation={this.setRelation.bind(this)}
          updateNode={this.updateNode.bind(this)}>
          {Object.keys(this.state.nodes[id].rel).map((id: Types.NodeId, index: number) => (
            this.getComponentTree(id)
          ))}
        </TreeNode>)
      : (<TreeNode
          key={id} 
          nodePath={[...this.state.environment.rootPath, id]} 
          nodeInfo={this.getNodeInfo(id)} 
          settings={this.state.settings} 
          render={this.state.settings.treeNodeComponent}
          getRelation={this.getRelation.bind(this)}
          setRelation={this.setRelation.bind(this)}
          updateNode={this.updateNode.bind(this)} 
          setPath={this.setPath.bind(this)}
          />)
    )
  }

  createNode(): any {

  }


  render (){
    return (
      <div className="chkflow-main">
        <Header  
          {...this.props} 
          setPath={this.setPath.bind(this)}
          rootPath={this.state.environment.rootPath} 
          homeNode={this.state.environment.homeNode}
        />
        <div className="nodes-container">
          {this.getComponentTree(this.state.environment.rootPath[this.state.environment.rootPath.length - 1])}
        </div>
      </div>
    )
  
  }
}


export default ChkFlowBase