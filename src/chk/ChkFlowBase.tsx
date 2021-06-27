import * as React from 'react'
import './style.scss'
import * as Types from './types' 
import Header from './Header'
import TreeNode from './TreeNode'
import * as R from 'ramda'
import { placeCursorFromBeginning, getNodeTailFromPath } from './UiUtils'
import { getNewId, 
  getVisuallyPreviousNodePath, 
  getVisuallyNextNodePath, 
  newChildUnderThisNode,
  setRelation,
  getRelation,
  newChild,
  getSubRelations,
  moveChildFromPath,
  moveUnderPreviousNode,
  newSubWithoutRelUsingKey,
  setNodeRel
} from './NodeUtils'

//Todo: make generic & use generics for storing info etc.
class ChkFlowBase extends React.Component<Types.ChkFlowBaseProps, Types.ChkFlowState> { 
  

  constructor(props: Types.ChkFlowBaseProps){
    super(props)
    this.state = {...this.state, environment: props.environment, nodes: props.nodes, settings: props.settings }
  }  

  getNodeInfo(id: Types.NodeId): any {
    return this.state.nodes[id]
  }
  getRelation(path: Types.NodeId[]){
    return getRelation(this.state, path)
  }

  updateNode(id: Types.NodeId, data: any ){
    this.setState({...this.state, nodes: {...this.state.nodes, [id]: { ...this.state.nodes[id], ...data } }})
  }
  
  newChild(path: Types.NodeId[]){
    this.setState(newChild(this.state, path))
  }

  setRootPath(path: Types.NodeId[]){
    this.setState({...this.state, environment: {...this.state.environment, rootPath: path }})
  }

  setRelation(path: Types.NodeId[], relation: Types.NodeId){
    this.setState(setRelation(this.state, path, relation))
  }

  newSubUsingKey(key: Types.NodeId, path: Types.NodeId[], relation: Types.NodeId): any {
    const defaults = { text: key, rel: {'child':[]}, isCollapsed: false  }
    let newState = setNodeRel(this.state, path[path.length - 1], relation, key)
    this.setState({...newState, 
      nodes: {...newState.nodes, 
        [key]: defaults, 
      }
    })
  }

  moveChildFromPath(path: Types.NodeId[], newParent: Types.NodeId){
    this.setState(moveChildFromPath(this.state,path, newParent ))
  }

  moveUnderPreviousNode(path: Types.NodeId[]){
    this.setState(moveUnderPreviousNode(this.state, path))
  }


  newChildUnderThisNode(path: Types.NodeId[]){
    let [id, newState] = newChildUnderThisNode(this.state, path)
    this.setState( newState, () => {
      let newNode = document.getElementById(id)?.querySelector('.node-tail');
      // console.log('newNode', newSubId,newNode);
      if (newNode){
        placeCursorFromBeginning(newNode as HTMLDivElement);
      }
    })
  }

  newSubWithoutRelUsingKey(key: Types.NodeId){
    this.setState(newSubWithoutRelUsingKey(this.state, key))
  }

  moveCursorToNodeFromBeginning(path: Types.NodeId[], offset:number = 0){
    let element = getNodeTailFromPath(path);
    placeCursorFromBeginning(element);
  }

  moveCursorToVisuallyPreviousNode(path: Types.NodeId[]){
    // console.log('move to prev', path)
    const previousNode = getVisuallyPreviousNodePath(this.state, path);
    // console.log('prev',previousNode);
    if (previousNode){
      this.moveCursorToNodeFromBeginning(previousNode)
    }
  }

  moveCursorToVisuallyNextNode(path: Types.NodeId[]){
    // console.log('move to next', path)
    const nextNode = getVisuallyNextNodePath(this.state, path);
    // console.log('next', nextNode)
    if (nextNode){
      this.moveCursorToNodeFromBeginning(nextNode)
    }
  }
  

  setActiveNode(path: Types.NodeId[]){
    // console.log("activated", path)
    this.setState({...this.state, 
      environment: {...this.state.environment, activeNode: path }
    })
  }

  toggleCollapse(path: Types.NodeId[]){
    let node = R.last(path) as string;
    console.log('node', node, path)
    if (node){
      console.log('node', this.state.nodes[node])
      this.setState({...this.state,
        nodes: {...this.state.nodes, 
          [node]: {...this.state.nodes[node],
            isCollapsed: !this.state.nodes[node].isCollapsed
          }
        }
      }, ()=>console.log(this.state))  
    }
  }

  getComponentTree(id: Types.NodeId, rel: Types.NodeId, path: Types.NodeId[]) {
    var that = this;
    const relations = getSubRelations(this.state, id)
    const hasRelations = (Object.keys(relations).length > 0);
    // console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
    return  (<TreeNode
        key={id}
        relation={rel}
        nodePath={[...path, id]} 
        nodeInfo={this.getNodeInfo(id)} 
        settings={this.state.settings} 
        render={this.state.settings.treeNodeComponent}
        setPath={this.setRootPath.bind(this)}
        getRelation={this.getRelation.bind(this)}
        setRelation={this.setRelation.bind(this)}
        newChild={this.newChild.bind(this)}
        activeNode={this.state.environment.activeNode}
        toggleCollapse={this.toggleCollapse.bind(this)}
        setActiveNode={this.setActiveNode.bind(this)}
        moveChildFromPath={this.moveChildFromPath.bind(this)}
        moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
        newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
        moveCursorToVisuallyNextNode={this.moveCursorToVisuallyNextNode.bind(this)}
        moveCursorToVisuallyPreviousNode={this.moveCursorToVisuallyPreviousNode.bind(this)}
        updateNode={this.updateNode.bind(this)}>
        {(hasRelations) ? Object.keys(this.state.nodes[id].rel).map((childRel: Types.NodeId, index: number) => (
          that.state.nodes[id].rel[childRel].map((childId: Types.NodeId, index: number)=>{
            return that.getComponentTree(childId, childRel, [...path, id])
          })
        )) : ''}
      </TreeNode>)
 
      
}




  render (){
    return (
      <div className="chkflow-main">
        <Header  
          {...this.props} 
          setPath={this.setRootPath.bind(this)}
          rootPath={this.state.environment.rootPath} 
          homeNode={this.state.environment.homeNode}
        />
        <div className="nodes-container">
          {this.getComponentTree(this.state.environment.rootPath[this.state.environment.rootPath.length - 1], 'root', this.state.environment.rootPath.slice(0, -1))}
        </div>
      </div>
    )
  
  }
}


export default ChkFlowBase