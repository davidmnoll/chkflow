import * as React from 'react'
import './style.scss'
import * as Types from './types' 
import Header from './Header'
import TreeNode from './TreeNode'
import * as R from 'ramda'

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
      Object.keys(this.state.nodes[path[path.length-2]].rel).forEach((relType:Types.NodeId, index:number)=>{
        if (this.state.nodes[path[path.length-2]][relType] == this.state.nodes[path[path.length-1]]){
          rel = relType;
        }
      })
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
            [relation]: [...this.state.nodes[path[path.length-2]].rel[relation] , path[path.length-1]] 
          }
        }
      }
    })
  }
  newChild(path: Types.NodeId[]){
    this.newSub(path, 'child')
  }

  newSub(path: Types.NodeId[], relation: Types.NodeId): any {
    const key = this.getNewId()
    this.newSubUsingKey(key, path, relation)

  }

  newSubWithoutRel(): any {
    const key = this.getNewId()
    this.newSubWithoutRelUsingKey(key)
    return key
  }

  newSubWithoutRelUsingKey(key: Types.NodeId): any {
    const defaults = { text: key, rel: {}, isCollapsed: false  }
    this.setState({...this.state, 
      nodes: {...this.state.nodes, 
        [key]: defaults, 
      }
    })
  }

  newSubUsingKey(key: Types.NodeId, path: Types.NodeId[], relation: Types.NodeId): any {
    const defaults = { text: key, rel: {}, isCollapsed: false  }
    this.setNodeRel(path[path.length - 1], relation, key)
    this.setState({...this.state, 
      nodes: {...this.state.nodes, 
        [key]: defaults, 
      }
    })
  }
  getSubDefaults(){
    
  }

  getNewId():Types.NodeId{
    function makeid(length:number) {
      var result           = [];
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      return result.join('');
    }
    let key = makeid(5);
    const keywords = ["child", "home", "root", "rel"]
    while( this.state.nodes[key] !== undefined || keywords.includes(key) ){
      let key = makeid(5);
    }
    return key
  }

  setNodeRel(baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
    const newRels = [...this.state.nodes[baseId].rel[relId], subId]
    console.log('setNodeRel - start', baseId, relId, subId, this.state.nodes, [...this.state.nodes[baseId].rel[relId]], [...this.state.nodes[baseId].rel[relId], subId], newRels)
    this.setState({...this.state, 
      nodes: {
        ...this.state.nodes, 
        [baseId]: {
          ...this.state.nodes[baseId], 
          rel: {
            ...this.state.nodes[baseId].rel, 
            [relId]: 'asdfasdfad' 
          } 
        } 
      }
    })
    console.log('setNodeRel - end', baseId, relId, subId, this.state.nodes)
  }

  delNodeRel(baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
    this.setState({...this.state, 
      nodes: {
        ...this.state.nodes, 
        [baseId]: {
          ...this.state.nodes[baseId], 
          rel: {
            ...this.state.nodes[baseId].rel, 
            [relId]: [...this.state.nodes[baseId].rel[relId].filter((key:Types.NodeId)=> key != subId)] 
          } 
        } 
      }
    })
  }

  setNodeChild(baseId: Types.NodeId, subId: Types.NodeId){
    this.setNodeRel(baseId, 'child', subId)
  }
  delNodeChild(baseId: Types.NodeId, subId: Types.NodeId){
    this.delNodeRel(baseId, 'child', subId)
  }
  moveChildFromPath(path: Types.NodeId[], newParent: Types.NodeId){
    this.setNodeChild( newParent, path[path.length - 1] )
    this.delNodeChild( path[path.length - 2], path[path.length - 1] )
  }

  moveUnderPreviousNode(path: Types.NodeId[]){
    const thisNodeRelation = this.getRelation(path)
    const thisNodeIndex = this.state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
    const previousNodeId = this.state.nodes[path[path.length - 2]].rel[thisNodeRelation][thisNodeIndex - 1]
    console.log('moveunder',this.state.nodes[path[path.length - 2]], thisNodeIndex, previousNodeId, thisNodeRelation, path)
    this.setNodeRel(previousNodeId, thisNodeRelation, path[path.length - 1])
    console.log('moveunder',this.state.nodes[previousNodeId], thisNodeIndex, previousNodeId, thisNodeRelation, path)
    this.delNodeRel(path[path.length - 2], thisNodeRelation, path[path.length - 1])
    console.log('moveunder',this.state.nodes[path[path.length - 2]], thisNodeIndex, previousNodeId, thisNodeRelation, path)
    
  }
  newChildUnderThisNode(path: Types.NodeId[]){
    const thisNodeRelation = this.getRelation(path)
    const thisNodeIndex = this.state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
    const newSubId = this.getNewId();
    const defaults = { text: newSubId, rel: {}, isCollapsed: false  }
    let newArr = [...this.state.nodes[path[path.length - 2]].rel[thisNodeRelation]]
    newArr.splice(thisNodeIndex + 1, 0, newSubId)
    this.setState({...this.state,
      nodes: {...this.state.nodes,
        [newSubId]: defaults,
        [path[path.length - 2]]: {
          ...this.state.nodes[path[path.length - 2]],
          rel: {
            ...this.state.nodes[path[path.length - 2]].rel,
            [thisNodeRelation] : newArr
          }
        }
      }
    })
  }


  getSubRelations(id: Types.NodeId){
    var that = this;
    let rels : {[key:string]: Types.NodeId} = {};
    if (this.state.nodes[id] === undefined ){
      console.error('id', id);
      console.error('state', this.state)
      throw('node DNE')
    }
    console.log('this node rels',id, that.state.nodes[id], this.state.nodes);
    Object.keys(this.state.nodes[id].rel).forEach((currentRel: Types.NodeId) => {
      // console.log('rels for this type',that.state.nodes[id].rel[currentRel])
      that.state.nodes[id].rel[currentRel].forEach((currentNode: Types.NodeId)=>{
        rels[currentNode] = currentRel;
      })
    });
    console.log('result',rels)
    return rels;
  }
  getTotalSubRelations(id:Types.NodeId){
    return Object.keys(this.getSubRelations(id)).length
  }

  getComponentTree(id: Types.NodeId, rel: Types.NodeId) {
    var that = this;
    const relations = this.getSubRelations(id)
    const hasRelations = (Object.keys(relations).length > 0);
    console.log('total rels', relations, id, this.state.nodes[id], (Object.keys(relations).length > 0) && true)
    return (hasRelations) ?  
      (<TreeNode
        key={id}
        relation={rel}
        nodePath={[...this.state.environment.rootPath, id]} 
        nodeInfo={this.getNodeInfo(id)} 
        settings={this.state.settings} 
        render={this.state.settings.treeNodeComponent}
        setPath={this.setPath.bind(this)}
        getRelation={this.getRelation.bind(this)}
        setRelation={this.setRelation.bind(this)}
        newChild={this.newChild.bind(this)}
        moveChildFromPath={this.moveChildFromPath.bind(this)}
        moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
        newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
        updateNode={this.updateNode.bind(this)}>
        {Object.keys(this.state.nodes[id].rel).map((childRel: Types.NodeId, index: number) => (
          that.state.nodes[id].rel[childRel].map((childId: Types.NodeId, index: number)=>{
            return that.getComponentTree(childId, childRel)
          })
        ))}
      </TreeNode>)
      : 
      (<TreeNode
        key={id} 
        relation={rel}
        nodePath={[...this.state.environment.rootPath, id]} 
        nodeInfo={this.getNodeInfo(id)} 
        settings={this.state.settings} 
        render={this.state.settings.treeNodeComponent}
        getRelation={this.getRelation.bind(this)}
        setRelation={this.setRelation.bind(this)}
        newChild={this.newChild.bind(this)}
        moveChildFromPath={this.moveChildFromPath.bind(this)}
        moveUnderPreviousNode={this.moveUnderPreviousNode.bind(this)}
        newChildUnderThisNode={this.newChildUnderThisNode.bind(this)}
        updateNode={this.updateNode.bind(this)} 
        setPath={this.setPath.bind(this)}
        />)
      
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
          {this.getComponentTree(this.state.environment.rootPath[this.state.environment.rootPath.length - 1], 'root')}
        </div>
      </div>
    )
  
  }
}


export default ChkFlowBase