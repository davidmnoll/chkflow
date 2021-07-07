import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 
import { 
  placeCursorFromBeginning,
  getNodeTailFromPath,
  getVisuallyPreviousNodePath, 
  getVisuallyNextNodePath, 
  newChildUnderThisNode,
  getSubs,
  moveUnderPreviousNode,
  moveUnderParent,
  pathCurrent,
  focusOnPath,
} from './Utils'
import * as M from './Maybe'
import {
  trace,
  traceBreak,
  traceFunc,
  traceQuiet
} from './Trace'

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
  homePath: [{rel:'root',id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}] as Types.NodePath,
  activeNode: null,
}



//Todo: make generic & use generics for storing info etc.
class ChkFlow extends React.Component<Types.ChkFlowState, Types.ChkFlowState> { 
  constructor(props: Types.ChkFlowState){
    super(props)

    const rootPath: Types.NodePath = [{id:'0', rel:'root'}];

    let state = {
      nodeComponent: props.nodeComponent, // or DefaultTreeNode
      containerComponent: props.containerComponent,
      defaultEnvironment: props.showDummies ? dummyEnvironment : {
        homePath: [{id:'0', rel:'root'}] as Types.NodePath,
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


  setStateAndSave(state: Types.ChkFlowState, callback: Function | null = null){
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
      environment:this.props.defaultEnvironment, 
      nodes:this.props.defaultNodes, 
    })
  }


  getNodeInfo(path: Types.NodePath): M.Maybe<Types.ChkFlowNode> {
    let maybeLastElem = pathCurrent(this.state, path)
    return maybeLastElem.handle((x: Types.PathElem) => this.state.nodes[x.id])
  }

  updateNode(path: Types.NodePath, data: Types.ChkFlowNode ){
    // console.log('updateNode',data);
    const maybeCurrNode = pathCurrent(this.state, path);
    maybeCurrNode.handle( (x: Types.PathElem) => {
      this.setStateAndSave({...this.state, nodes: {...this.state.nodes, [x.id]: { ...this.state.nodes[x.id], ...data } }})  
    })
  }
  
  setHomePath(path: Types.NodePath){
    this.setStateAndSave({...this.state, environment: {...this.state.environment, homePath: path }})
  }

  moveUnderPreviousNode(path: Types.NodePath){
    moveUnderPreviousNode(this.state, path).handle((x: Types.ChkFlowState) => {
      this.setStateAndSave(x, ()=> focusOnPath(x, path) )
    })
  }

  moveUnderGrandParentBelowParent(path:Types.NodePath){
    moveUnderParent(this.state, path).handle((x: Types.ChkFlowState) => {
      this.setStateAndSave(x, ()=> focusOnPath(x, path) )
    })
  }

  newChildUnderThisNode(path: Types.NodePath){
    // console.log('start state',this.state.nodes)
    let maybeNewChildState : M.Maybe<[Types.NodePath,Types.ChkFlowState]> = newChildUnderThisNode(this.state, path).throw()
    // console.log(maybeNewChildState)
    maybeNewChildState.handle( (pathState: [Types.NodePath,Types.ChkFlowState])  => {
      // console.log('pathstate', pathState)
      this.setStateAndSave( pathState[1], () => {
        focusOnPath(pathState[1], pathState[0])
      })
  
    })
    // console.log('newState',newState.nodes)
  
  }


  moveCursorToNodeFromBeginning(path: Types.NodePath, offset:number = 0){
    getNodeTailFromPath(this.state, path).handle( (node_tail: HTMLDivElement)=> placeCursorFromBeginning(node_tail));
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

  renderNodeChildren(path :Types.NodePath): M.Maybe<React.ReactNode[]>{
    return getSubs(this.state, path).handle((x: Types.NodePath[]) => {
      return x.map((y: Types.NodePath) => (this.getNodeTree(y, true).dump()))
    })
  }


  getNodeTree(path: Types.NodePath, renderLayer:boolean): M.Maybe<React.ReactNode> {
      return pathCurrent(this.state, path).handle( (curr: Types.PathElem) => {
        const maybeNodeInfo: M.Maybe<Types.ChkFlowNode> = this.getNodeInfo(path)
        const nodeInfo : Types.ChkFlowNode | null = maybeNodeInfo.dump()
        const TreeNodeDisplay = this.state.nodeComponent as React.ElementType
        // console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
        if (renderLayer){
          return  (<TreeNodeDisplay
            key={curr.id}
            pathElem={curr}
            nodePath={[...path]} 
            nodeInfo={traceQuiet(nodeInfo)}
            activeNode={this.state.environment.activeNode}
            setPath={this.setHomePath.bind(this)}
            setActiveNode={this.setActiveNode.bind(this)}
            moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
            newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
            moveCursorToVisuallyNextNode={this.moveCursorToVisuallyNextNode.bind(this)}
            moveCursorToVisuallyPreviousNode={this.moveCursorToVisuallyPreviousNode.bind(this)}
            updateNode={this.updateNode.bind(this)}>
            {nodeInfo?.isCollapsed ? '' : this.renderNodeChildren(path).dump()}
          </TreeNodeDisplay>)
        }else{
          return (nodeInfo?.isCollapsed ? '' : this.renderNodeChildren(path).dump())
        }
      })
  }


  render (){
    const ContainerDisplay = this.props.containerComponent as React.ElementType;
    return (            
          <ContainerDisplay
            environment={this.state.environment}
            nodes={this.state.nodes}
            setPath={this.setHomePath.bind(this)}
            resetNodes={this.resetNodes.bind(this)}
            >
            {this.getNodeTree(this.state.environment.homePath, false).dump()}
          </ContainerDisplay>  
    )
  
  }
}

export { Types, ChkFlow }
export default ChkFlow

