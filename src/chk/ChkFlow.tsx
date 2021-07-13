import * as React from 'react'
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
  pathCurrentLast,
  focusOnPath,
} from './Utils'
import { Maybe, Just, Nothing } from 'purify-ts/Maybe'

import {
  dummyNodes,
  dummyEnvironment,
  defaultNodes,
  defaultEnvironment
} from './Contant'
import DefaultContainer from './DefaultContainer'
import DefaultTreeNode from './DefaultTreeNode'

//Todo: make generic & use generics for storing info etc.
class ChkFlow extends React.Component<Partial<Types.ChkFlowState>, Types.ChkFlowState> { 
  constructor(props: Partial<Types.ChkFlowState>){
    super(props)

    const rootPath: Types.NodePath = [{id:'0', rel:'root'}];

    let state = {
      nodeComponent: props.nodeComponent || DefaultTreeNode, // or DefaultTreeNode
      containerComponent: props.containerComponent || DefaultContainer,
      showDummies: ( props.showDummies !== undefined ) ? props.showDummies : false, 
      defaultEnvironment: props.showDummies ? dummyEnvironment : {
        homePath: [{id:'0', rel:'root'}] as Types.NodePath,
        activeNode: null,
      },
      defaultNodes: props.showDummies ? dummyNodes : {
        '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1']}, isCollapsed: false },
        '1' : { text: '', rel: {'child': []}, isCollapsed: false  },
      },
      setStateCallback: props.setStateCallback ? props.setStateCallback : ()=>{},
    }

    const nodes = props.nodes ? props.nodes : state.defaultNodes;
    const environment = props.environment ? props.environment : state.defaultEnvironment;
    this.state = { ...state, environment: environment, nodes: nodes }
  }  


  setStateAndSave(state: Types.ChkFlowState, callback: Function | null = null){
    this.setState(state, ()=>{
      // this.state.setStateCallback(this.state)
      if(callback !== null){
        callback(this.state);
      }
    })

  }

  
  resetNodes(){

    const correctDefaultNodes = this.state.showDummies ? dummyNodes : defaultNodes
    const correctDefaultEnvironment = this.state.showDummies ? dummyEnvironment : defaultEnvironment
    

    const backupNodes = this.state.defaultNodes ? this.state.defaultNodes : defaultNodes;
    const backupEnvironment = this.state.defaultEnvironment ? this.state.defaultEnvironment : defaultEnvironment;


    this.setStateAndSave({...this.state, 
      environment: backupEnvironment, 
      nodes: backupNodes, 
    })
  }


  getNodeInfo(path: Types.NodePath): Maybe<Types.ChkFlowNode> {
    let maybeLastElem = pathCurrentLast(this.state, path)
    return maybeLastElem.map((x: Types.PathElem) => this.state.nodes[x.id])
  }

  updateNode(path: Types.NodePath, data: Types.ChkFlowNode ){
    // console.log('updateNode',data);
    let p = new Promise((resolve, reject)=>{
      const maybeCurrNode = pathCurrentLast(this.state, path);
      maybeCurrNode.map( async (x: Types.PathElem) => {
        this.setStateAndSave({...this.state, nodes: {...this.state.nodes, [x.id]: { ...this.state.nodes[x.id], ...data } }}, ()=>{
        resolve(this.state)
        })
  
      })
    })
    const maybeCurrNode2 = pathCurrentLast(this.state, path);
    maybeCurrNode2.map( async (x: Types.PathElem) => {
      this.setStateAndSave({...this.state, nodes: {...this.state.nodes, [x.id]: { ...this.state.nodes[x.id], ...data } }})
    })
    return p
  }
  
  setHomePath(path: Types.NodePath){
    this.setStateAndSave({...this.state, environment: {...this.state.environment, homePath: path }})
  }

  //Indent
  moveUnderPreviousNode(path: Types.NodePath){
    moveUnderPreviousNode(this.state, path).map((x: Types.ChkFlowState) => {
      this.setStateAndSave(x, ()=> focusOnPath(x, path) )
    })
  }

  //Unindent
  moveUnderGrandParentBelowParent(path:Types.NodePath){
    moveUnderParent(this.state, path).map((x: Types.ChkFlowState) => {
      this.setStateAndSave(x, ()=> focusOnPath(x, path) )
    })
  }

  //New Line
  newChildUnderThisNode(path: Types.NodePath){
    // console.log('start state',this.state.nodes)
    let maybeNewChildState : Maybe<[Types.NodePath,Types.ChkFlowState]> = newChildUnderThisNode(this.state, path)
    // console.log(maybeNewChildState)
    maybeNewChildState.map( (pathState: [Types.NodePath,Types.ChkFlowState])  => {
      // console.log('pathstate', pathState)
      this.setStateAndSave( pathState[1], () => {
        focusOnPath(pathState[1], pathState[0])
      })
  
    })
    // console.log('newState',newState.nodes)
  
  }

  //Move cursor to beginning of line (with offset) -- not working but also not very important
  moveCursorToNodeFromBeginning(path: Types.NodePath, offset:number = 0){
    getNodeTailFromPath(this.state, path).map( (node_tail: HTMLDivElement)=> placeCursorFromBeginning(node_tail));
  }

  //move cursor down
  moveCursorToVisuallyPreviousNode(path: Types.NodePath){
    // console.log('move to prev', path)
    const maybePreviousNode = getVisuallyPreviousNodePath(this.state, path);
    // console.log('prev',previousNode);
    maybePreviousNode.map(previousNode => {
      this.setActiveNode(previousNode)
      this.moveCursorToNodeFromBeginning(previousNode)
    })
  }

  //move cursor down
  moveCursorToVisuallyNextNode(path: Types.NodePath){
    // console.log('move to next', path)
    const maybeNextNode = getVisuallyNextNodePath(this.state, path);
    // console.log('next', nextNode)
    maybeNextNode.map( nextNode => {
      this.setActiveNode(nextNode)
      this.moveCursorToNodeFromBeginning(nextNode)
    })
  }

  
  // "highlight node"
  setActiveNode(path: Types.NodePath){
    // console.log("activated", path)
    this.setStateAndSave({...this.state, 
      environment: {...this.state.environment, activeNode: path }
    })
  }



  renderNodeChildren(path :Types.NodePath): Maybe<React.ReactNode[]>{
    return getSubs(this.state, path).map((x: Types.NodePath[]) => {
      return x.map((y: Types.NodePath) => (this.getNodeTree(y, true).extractNullable()))
    })
  }


  getNodeTree(path: Types.NodePath, renderLayer:boolean): Maybe<React.ReactNode> {
      return pathCurrentLast(this.state, path).map( (curr: Types.PathElem) => {
        const maybeNodeInfo: Maybe<Types.ChkFlowNode> = this.getNodeInfo(path)
        const nodeInfo : Types.ChkFlowNode | null = maybeNodeInfo.extractNullable()
        const NodeDisplay = this.state.nodeComponent as React.ElementType
        // console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
        if (renderLayer){
          return  (<NodeDisplay
            key={curr.id}
            pathElem={curr}
            nodePath={[...path]} 
            nodeInfo={nodeInfo}
            activeNode={this.state.environment.activeNode}
            setPath={this.setHomePath.bind(this)}
            setActiveNode={this.setActiveNode.bind(this)}
            moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
            moveUnderGrandParentBelowParent ={this.moveUnderGrandParentBelowParent.bind(this)}
            newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
            moveCursorToVisuallyNextNode={this.moveCursorToVisuallyNextNode.bind(this)}
            moveCursorToVisuallyPreviousNode={this.moveCursorToVisuallyPreviousNode.bind(this)}
            updateNode={this.updateNode.bind(this)}>
            {nodeInfo?.isCollapsed ? '' : this.renderNodeChildren(path).extractNullable()}
          </NodeDisplay>)
        }else{
          return (nodeInfo?.isCollapsed ? '' : this.renderNodeChildren(path).extractNullable())
        }
      })
  }


  render (){
    const ContainerDisplay = this.state.containerComponent as React.ElementType;
    return (            
          <ContainerDisplay
            environment={this.state.environment}
            nodes={this.state.nodes}
            setPath={this.setHomePath.bind(this)}
            resetNodes={this.resetNodes.bind(this)}
            >
            {this.getNodeTree(this.state.environment.homePath, false).extractNullable()}
          </ContainerDisplay>  
    )
  
  }
}

export { ChkFlow }
export default ChkFlow

