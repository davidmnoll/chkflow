import * as React from 'react'
import './style.scss'
import * as Types from './types' 
import Header from './Header'
import DefaultTreeNode from './DefaultTreeNode'
import { 
  placeCursorFromBeginning,
  getNodeTailFromPath,
  getNewId, 
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
  setNodeRel,
  moveUnderParent,
  lastFromPath,
  getNodePathFromStringArray
} from './Utils'


const dummyNodes = {
  '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1','3']}, isCollapsed: false },
  '1' : { text: 'chores', rel: {'child': ['5', '2']}, isCollapsed: false  },
  '2' : { text: 'clean', rel: {'child': ['4']}, isCollapsed: false  },
  '3' : { text: 'study', rel: {'child': []}, isCollapsed: false  },
  '4' : { text: 'bathroom', rel: {'child': []}, isCollapsed: false  },
  '5' : { text: 'groceries', rel: {'child': ['6','7']}, isCollapsed: false  },
  '6' : { text: 'milk', rel: {'child': []}, isCollapsed: false  },
  '7' : { text: 'eggs', rel: {'child': []}, isCollapsed: false  },
}
const dummyEnvironment = {
  homePath: ['0', '1', '5'],
  activeNode: [],
}



//Todo: make generic & use generics for storing info etc.
class ChkFlow<ThisNodeInfo, ThisEnvironment> extends React.Component<Types.ChkFlowSettings<ThisNodeInfo, ThisEnvironment>,Types.ChkFlowState<ThisNodeInfo, ThisEnvironment>> { 
  constructor(props: Types.ChkFlowSettings<ThisNodeInfo, ThisEnvironment>){
    super(props)

    let rootPath: Types.NodeRootPath = ['0'] as Types.NodeRootPath;

    let state = {
      nodeComponent: props.nodeComponent, // or DefaultTreeNode
      defaultEnvironment: props.showDummies ? dummyEnvironment : {
        homePath: rootPath as Types.NodeRootPath,
        activeNode: null,
      },
      defaultNodes: props.showDummies ? dummyNodes : {
        '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1']}, isCollapsed: false },
        '1' : { text: '', rel: {'child': []}, isCollapsed: false  },
      },
      setStateCallback: props.setStateCallback ? props.setStateCallback : ()=>{},
      showDummies: props.showDummies
    }

    const nodes = props.nodes ? props.nodes : state.defaultNodes;
    const environment = props.environment ? props.environment : state.defaultEnvironment;
    this.state = { ...state, environment: environment, nodes: nodes }

  }  


  setStateAndSave(state: Types.ChkFlowState<ThisNodeInfo, ThisEnvironment>, callback: Function | null = null){
    this.setState(state, ()=>{
      if(callback !== null){
        callback(this.state);
      }
    })
  }

  
  resetNodes(){
    console.log('reset', this.state.defaultNodes, this.state.defaultEnvironment)

    const defaultNodes = this.props.showDummies ? dummyNodes : {
      '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1']}, isCollapsed: false },
      '1' : { text: '', rel: {'child': []}, isCollapsed: false  },
    }
    const defaultEnvironment = this.props.showDummies ? dummyEnvironment : {
      homePath: ['0'],
      activeNode: [],
    }

    const nodes = this.props.nodes ? this.props.nodes : defaultNodes;
    const environment = this.props.environment ? this.props.environment : defaultEnvironment;

 

    this.setStateAndSave({...this.state, 
      environment:this.props.options.defaultEnvironment, 
      nodes:this.props.options.defaultNodes, 
    })
  }


  getNodeInfo(path: Types.NodePath): Types.ChkFlowNode<ThisNodeInfo> {
    let id: Types.NodeId = lastFromPath(path)
    return this.state.nodes[id]
  }
  getRelation(path: Types.NodePath){
    return getRelation(this.state, path)
  }

  updateNode(path: Types.NodePath, data: any ){
    // console.log('updateNode',data);
    let currNode = lastFromPath(path);
    this.setStateAndSave({...this.state, nodes: {...this.state.nodes, [currNode]: { ...this.state.nodes[currNode], ...data } }})  
  }
  
  newChild(path: Types.NodePath){
    this.setStateAndSave(newChild(this.state, path))
  }

  setRootPath(path: Types.NodePath){
    this.setStateAndSave({...this.state, environment: {...this.state.environment, rootPath: path }})
  }

  setRelation(path: Types.NodePath, relation: Types.NodeId){
    this.setStateAndSave(setRelation(this.state, path, relation))
  }

  newSubUsingKey(key: Types.NodeId, path: Types.NodePath, relation: Types.NodeId): any {
    const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
    let newState = setNodeRel(this.state, path[path.length - 1], relation, key)
    this.setStateAndSave({...newState, 
      nodes: {...newState.nodes, 
        [key]: defaults, 
      }
    })
  }

  moveChildFromPath(path: Types.NodePath, newParent: Types.NodeId){
    this.setStateAndSave(moveChildFromPath(this.state,path, newParent ))
  }

  moveUnderPreviousNode(path: Types.NodePath){
    let moveState = moveUnderPreviousNode(this.state, path)
    if (moveState){
      this.setStateAndSave(moveState, ()=>{
        let nodePath = lastFromPath(path)
        let node = document.getElementById(nodePath)?.querySelector('.node-tail');
        // console.log('newStateNow', this.state.nodes);
          placeCursorFromBeginning(node as HTMLDivElement);
      })
    }
  }
  moveUnderGrandParentBelowParent(path:Types.NodePath){
    // console.log('move under parent');
    let moveState = moveUnderParent(this.state, path)
    if(moveState){
      this.setStateAndSave(moveState, ()=>{
        let nodePath = lastFromPath(path)
        let node = document.getElementById(nodePath)?.querySelector('.node-tail');
        // console.log('newStateNow', this.state.nodes);
          placeCursorFromBeginning(node as HTMLDivElement);
      })
    }
  }

  newChildUnderThisNode(path: Types.NodePath){
    // console.log('start state',this.state.nodes)
    let [id, newState] = newChildUnderThisNode(this.state, path)
    // console.log('newState',newState.nodes)
    this.setStateAndSave( newState, () => {
      let newNode = document.getElementById(id)?.querySelector('.node-tail');
      // console.log('newStateNow', this.state.nodes);
      if (newNode){
        placeCursorFromBeginning(newNode as HTMLDivElement);
      }
    })
  
  }

  newSubWithoutRelUsingKey(key: Types.NodeId){
    this.setStateAndSave(newSubWithoutRelUsingKey(this.state, key))
  }

  moveCursorToNodeFromBeginning(path: Types.NodePath, offset:number = 0){
    let element = getNodeTailFromPath(path);
    placeCursorFromBeginning(element);
  }

  moveCursorToVisuallyPreviousNode(path: Types.NodePath){
    // console.log('move to prev', path)
    const previousNode = getVisuallyPreviousNodePath(this.state, path);
    // console.log('prev',previousNode);
    if (!previousNode.empty){
      return this.moveCursorToNodeFromBeginning(previousNode.content)
    }
  }

  moveCursorToVisuallyNextNode(path: Types.NodePath){
    // console.log('move to next', path)
    const nextNode = getVisuallyNextNodePath(this.state, path);
    // console.log('next', nextNode)
    if (!nextNode.empty){
      this.moveCursorToNodeFromBeginning(nextNode.content)
    }
  }
  

  setActiveNode(path: Types.NodePath){
    // console.log("activated", path)
    this.setStateAndSave({...this.state, 
      environment: {...this.state.environment, activeNode: path }
    })
  }

  toggleCollapse(path: Types.NodePath){
    let node = lastFromPath(path);
    console.log('node', node, path)
    if (node){
      console.log('node', this.state.nodes[node])
      this.setStateAndSave({...this.state,
        nodes: {...this.state.nodes, 
          [node]: {...this.state.nodes[node],
            isCollapsed: !this.state.nodes[node].isCollapsed
          }
        }
      }, ()=>console.log(this.state))  
    }
  }

  getComponentTree(id: Types.NodeId, rel: Types.NodeId, path: Types.NodePath, renderLayer:boolean):React.ReactNode{
    var that = this;
    const relations = getSubRelations(this.state, id)
    const hasRelations = (Object.keys(relations).length > 0);
    const nodeInfo = this.getNodeInfo([...path,id])
    const TreeNodeDisplay = this.state.options.treeNodeComponent as React.ElementType
    // console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
    if (renderLayer){
      return  (<TreeNodeDisplay
        key={id}
        relation={rel}
        nodePath={[...path, id]} 
        nodeInfo={nodeInfo}
        isCollapsed={nodeInfo.isCollapsed} 
        settings={this.state.options} 
        render={this.state.options.treeNodeComponent}
        setPath={this.setRootPath.bind(this)}
        getRelation={this.getRelation.bind(this)}
        setRelation={this.setRelation.bind(this)}
        newChild={this.newChild.bind(this)}
        activeNode={this.state.environment.activeNode}
        toggleCollapse={this.toggleCollapse.bind(this)}
        setActiveNode={this.setActiveNode.bind(this)}
        moveChildFromPath={this.moveChildFromPath.bind(this)}
        moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
        moveUnderParent={this.moveUnderGrandParentBelowParent.bind(this)}
        newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
        moveCursorToVisuallyNextNode={this.moveCursorToVisuallyNextNode.bind(this)}
        moveCursorToVisuallyPreviousNode={this.moveCursorToVisuallyPreviousNode.bind(this)}
        updateNode={this.updateNode.bind(this)}>
        {(hasRelations) ? Object.keys(this.state.nodes[id].rel).map((childRel: Types.NodeId, index: number) => (
          that.state.nodes[id].rel[childRel].map((value: Types.NodeId, index: number)=>{
            return that.getComponentTree(childId, childRel, [...path, id], true)
          })
        )) : ''}
      </TreeNodeDisplay>)
    }else{
      return ((hasRelations) ? Object.keys(this.state.nodes[id].rel).map((childRel: Types.NodeId, index: number) => (
        that.state.nodes[id].rel[childRel].map((childId: Types.NodeId, index: number)=>{
          return that.getComponentTree(childId, childRel, [...path, id], true)
        })
      )) : '')
    }
 
      
}




  render (){
    return (            

      <div className="chkflow-container">
        <div className="chkflow-main">
          <Header  
            {...this.props} 
            setPath={this.setRootPath.bind(this)}
            rootPath={this.state.environment.rootPath} 
            homeNode={this.state.environment.homeNode}
            nodes={this.state.nodes}
            resetNodes={this.resetNodes.bind(this)}
          />
          <div className="nodes-container">
            {this.getComponentTree(this.state.environment.rootPath[this.state.environment.rootPath.length - 1], 'root', this.state.environment.rootPath.slice(0, -1), false)}
          </div>
        </div>
      </div>
    )
  
  }
}

export { Types, ChkFlow }
export default ChkFlow

