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
  changeRelType, 
  linkNode
} from './Utils'
import { Maybe, Just, Nothing } from 'purify-ts/Maybe'
import { Either, Left, Right } from 'purify-ts/Either'

import {
  dummyNodes,
  dummyEnvironment,
  defaultNodes,
  defaultEnvironment
} from './default/Constant'
import DefaultContainer from './default/DefaultContainer'
import DefaultTreeNode from './default/DefaultTreeNode'
import ExecContainer from './exec/ExecContainer'
import ExecTreeNode from './exec/ExecTreeNode'

import {
  dummyExecNodes,
  dummyExecEnvironment,
  defaultExecNodes,
  defaultExecEnvironment
} from './exec/Constant'
import { RestoreOutlined } from '@material-ui/icons'
//Todo: make generic & use generics for storing info etc.
class ChkFlow extends React.Component<Partial<Types.ChkFlowState>, Types.ChkFlowState> { 
  constructor(props: Partial<Types.ChkFlowState>){
    super(props)

    const rootPath: Types.NodePath = [{id:'0', rel:'root'}];

    let state = {
      execEnabled: props.execEnabled !== undefined ? props.execEnabled : false,
      nodeComponent: props.nodeComponent || props.execEnabled ? ExecTreeNode : DefaultTreeNode, // or DefaultTreeNode
      containerComponent: props.containerComponent || props.execEnabled ? ExecContainer : DefaultContainer,
      showDummies: ( props.showDummies !== undefined ) ? props.showDummies : false, 
      ...( props.execEnabled 
        ? {
          defaultNodes: props.showDummies ? dummyExecNodes : defaultExecNodes,
          defaultEnvironment: props.showDummies ? dummyExecEnvironment : defaultExecEnvironment
        } 
        : {
          defaultNodes: props.showDummies ? dummyNodes : defaultNodes,
          defaultEnvironment: props.showDummies ? dummyEnvironment : defaultEnvironment
      }),
      setStateCallback: props.setStateCallback ? props.setStateCallback : ()=>{},
    }

    const nodes = props.nodes ? props.nodes : state.defaultNodes;
    const environment = props.environment ? props.environment : state.defaultEnvironment;
    this.state = { ...state, environment: environment, nodes: nodes }
  }  


  setStateAndSave(state: Types.ChkFlowState, callback: Function | null = null){
    // console.log('SETSTATE', state)
    return this.setState(state, ()=>{
      // this.state.setStateCallback(this.state)
      // console.log('state changed', this.state)
      if(callback !== null){
        callback();
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
    return maybeLastElem.chainNullable((x: Types.PathElem) => this.state.nodes[x.id])
  }

  getRelNodeInfo(path: Types.NodePath): Maybe<[string, Types.ChkFlowNode]> {
    let maybeLastElem = pathCurrentLast(this.state, path)
    return maybeLastElem.chainNullable((x: Types.PathElem) => this.state.nodes[x.rel] !== undefined ? [x.rel, this.state.nodes[x.rel]] : null)
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

  updatePathRel(path: Types.NodePath, rel: string ){
    // console.log('updatePathRel', path, rel)
    return changeRelType(this.state, path, rel).map(
      newState => {
        this.setStateAndSave(newState, ()=> {
          // console.log('newState', this.state, newState);
          let lastElem = path.pop() as Types.PathElem;
          let newPath = [...path, {id: lastElem.id, rel: rel}] as Types.NodePath
          this.setHomePath(newPath)
        })
        return newState
      }
    )
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

  getNodeLabel(nodeId: Types.NodeId){
    // eventually use aliases
    return nodeId;
  }

  setIsLinking(isLinking: boolean){
    this.setStateAndSave({...this.state, 
      environment: {...this.state.environment, isLinking: isLinking }
    })
  }

  linkNode(path: Types.NodePath, nodeId: Types.NodeId){
    console.log('before link', this.state);
    linkNode(this.state, path, nodeId).map( newState => {
      console.log('after link before save', newState);
      this.setStateAndSave(newState, () => {
        this.setIsLinking(false)
      }) 
    })
  }
  
  // "highlight node"
  setActiveNode(path: Types.NodePath){
    // console.log("activated", path)
    this.setStateAndSave({...this.state, 
      environment: {...this.state.environment, activeNode: path }
    })
  }

  getNodeResultData(path: Types.NodePath, relKey: Types.NodeId): Maybe<Types.ChkFlowNodeData> {
    let maybeLastElem = pathCurrentLast(this.state, path)
    return maybeLastElem.chainNullable((x: Types.PathElem) => this.state.nodes[x.id].data[relKey])
  }

  evaluateNode(path: Types.NodePath) : any{
    const maybeNodeInfo = this.getNodeInfo(path);
    const maybeRelNodeInfo = this.getRelNodeInfo(path);
    console.log("evaluate node", path, maybeNodeInfo, maybeRelNodeInfo)
    maybeNodeInfo.map( (nodeInfo: Types.ChkFlowNode) => {
      console.log('found node info', nodeInfo)
      Object.entries(nodeInfo.rel).forEach(([rel, nodeIds]) => {
        nodeIds.forEach(nodeId => {
          this.evaluateNode([...path, {id: nodeId, rel: rel}])
        })
      })
      console.log('evaluated children')
      maybeRelNodeInfo.map( ([relKey, relNodeInfo]: [Types.NodeId, Types.ChkFlowNode]) => {
        const relResults = Object.entries(nodeInfo.rel).map(([rel, nodeIds]) => {
          return nodeIds.map(nodeId => {
            return this.getNodeResultData([...path, {id: nodeId, rel: rel}], rel)
          })

        })
        if (relKey === 'task'){
          console.log("rel is task")

          const isReady = relResults.length > 0 ? relResults.flat().every(x => x.equals(Just(true))) : nodeInfo.data[relKey] === true
          const isFinished = nodeInfo.data[relKey] === true && isReady
          console.log("is finsihed?", isFinished)
          if (isReady){
            console.log("is ready")
            this.updateNode(path, {...nodeInfo, data: {[relKey]: isFinished}, rel: {}})
          }else{
            console.log("is not ready", relResults)
          } 
        } else {
          console.log('other rel chosen', relKey)
        }
      })

    });

  }


  renderNodeChildren(path :Types.NodePath): Maybe<React.ReactNode[]>{
    return getSubs(this.state, path).map((x: Types.NodePath[]) => {
      // console.log('renderNodeChildren get subs', x)
      return x.map((y: Types.NodePath) => (this.getNodeTree(y, true).extractNullable()))
    })
  }


  getNodeTree(path: Types.NodePath, renderLayer:boolean): Maybe<React.ReactNode> {
      return pathCurrentLast(this.state, path).map( (curr: Types.PathElem) => {
        const maybeNodeInfo: Maybe<Types.ChkFlowNode> = this.getNodeInfo(path)
        const nodeInfo : Types.ChkFlowNode | null = maybeNodeInfo.extractNullable()
        const NodeDisplay = this.state.nodeComponent as React.ElementType
        // console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
        const thisNodeId = pathCurrentLast(this.state, path).extractNullable()?.id
        const thisRelKey = pathCurrentLast(this.state, path).extractNullable()?.rel
        const reduciblePath = path as Types.PathElem[]
        const isSecondInCycle = reduciblePath.reduce((acc: number, current: Types.PathElem) => ( (current.id === thisNodeId) ? acc + 1 : acc), 0) > 1
        // console.log('render layer', renderLayer)
        if (renderLayer){
          return  (<NodeDisplay
            key={curr.id}
            pathElem={curr}
            nodePath={[...path]} 
            nodeInfo={nodeInfo}
            activeNode={this.state.environment.activeNode}
            isLinking={this.state.environment.isLinking}
            setIsLinking={this.setIsLinking.bind(this)}
            setPath={this.setHomePath.bind(this)}
            setActiveNode={this.setActiveNode.bind(this)}
            moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
            moveUnderGrandParentBelowParent ={this.moveUnderGrandParentBelowParent.bind(this)}
            newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
            moveCursorToVisuallyNextNode={this.moveCursorToVisuallyNextNode.bind(this)}
            moveCursorToVisuallyPreviousNode={this.moveCursorToVisuallyPreviousNode.bind(this)}
            updateNode={this.updateNode.bind(this)}
            updatePathRel={this.updatePathRel.bind(this)}
            relKeys={Object.keys(this.state.nodes)}
            linkNode={this.linkNode.bind(this)}
            relId={thisRelKey}
            getNodeLabel={this.getNodeLabel.bind(this)}>
            {nodeInfo?.isCollapsed || isSecondInCycle ? '' : this.renderNodeChildren(path).extractNullable()}
          </NodeDisplay>)
        }else{
          return (nodeInfo?.isCollapsed ? '' : this.renderNodeChildren(path).extractNullable())
        }
      })
  }


  render (){
    const ContainerDisplay = this.state.containerComponent as React.ElementType;
    const nodeTree = this.getNodeTree(this.state.environment.homePath, false).extractNullable()
    // console.log("rerendered", this.state, nodeTree)
    return (            
          <ContainerDisplay
            environment={this.state.environment}
            nodes={this.state.nodes}
            setPath={this.setHomePath.bind(this)}
            resetNodes={this.resetNodes.bind(this)}
            path={this.state.environment.homePath}
            getNodeInfo={this.getNodeInfo.bind(this)}
            updateNode={this.updateNode.bind(this)}
            getRelNodeInfo={this.getRelNodeInfo.bind(this)}
            updatePathRel={this.updatePathRel.bind(this)}
            relId={this.state.environment.homePath[this.state.environment.homePath.length - 1].rel}
            relKeys={Object.keys(this.state.nodes)}
            evaluateNode={this.evaluateNode.bind(this)}
            >
            {nodeTree}
          </ContainerDisplay>  
    )
  
  }
}

export default ChkFlow

