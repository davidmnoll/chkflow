import * as Types from './types' 
import * as R from 'ramda'
import { Type } from 'typescript';
import { exception } from 'console';
import { stat } from 'fs';

function lastFromPath(path: Types.NodePath | Types.NodeRootPath | Types.NodeBasePath): Types.NodeId {
  return path[path.length - 1]
}
function getNodeIdFromString(str: string): Types.NodeId {
  if (str === "0" ){
    return "test" as Types.NodeId;
  }else if (str === "1"){
    return "test" as Types.NodeId;
  }else if (str === "child"){
    return "test" as Types.NodeId;
  }else{
    return str as Types.NodeId;
  }
}

function getNodePathFromStringArray(strings: string[]){

}

function getRootPaths<S>(state: S):Types.NodeRootPath[]{
  let allIds: Set<Types.NodeId> = new Set()
  let childIds: Set<Types.NodeId> = new Set()
  Object.keys(state.nodes).forEach((key:Types.NodeId, index:number)=>{
    let node = state.nodes[key];
    allIds.add(key)
    Object.keys(node.rel).forEach((relType:string, relIndex:number)=>{
      node.rel[relType].forEach((subNode:Types.NodeId, subIndex:number)=>{
        childIds.add(subNode)
      })
    })
  })
  let difference = Array.from(allIds).filter(x => !childIds.has(x))
  console.log('difference',difference, allIds, childIds)
  return difference.map((x:Types.NodeId, index:number ): Types.NodeRootPath=>{return [x]})
}

function getRelation<S>(state: S, path: Types.NodePath){
    var rel: Types.NodeId = 'child';
    if (path.length == 1){
      rel = "root";
    }else{
      Object.keys(state.nodes[path[path.length-2]].rel).forEach((relType:Types.NodeId, index:number)=>{
        if (state.nodes[path[path.length-2]][relType] == state.nodes[path[path.length-1]]){
          rel = relType;
        }
      })
    }
    return rel;
}
function setRelation<S>(state: S, path: Types.NodePath, relation: Types.NodeId){
    return {...state, 
      nodes: {
        ...state.nodes, 
        [path[path.length-2]]: {
          ...state.nodes[path[path.length-2]], 
          rel: {
            [relation]: [...state.nodes[path[path.length-2]].rel[relation] , path[path.length-1]] 
          }
        }
      }
    }
  }
function newChild<S>(state: S, path: Types.NodePath){
    return newSub(state, path, 'child')
}

function newSub<S>(state: S, path: Types.NodePath, relation: Types.NodeId): any {
    const key = getNewId(state)
    return newSubUsingKey(state, key, path, relation)

}

function newSubWithoutRel<S>(state: S): any {
    const key = getNewId(state)
    newSubWithoutRelUsingKey(state, key)
    return key
}

function newSubWithoutRelUsingKey<S>(state: S, key: Types.NodeId): any {
    const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
    return {...state, 
      nodes: {...state.nodes, 
        [key]: defaults, 
      }
    }
}

function newSubUsingKey<S>(state:S, key: Types.NodeId, path: Types.NodePath, relation: Types.NodeId): any {
    const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
    let newState = setNodeRel(state, path[path.length - 1], relation, key)
    return {...newState, 
      nodes: {...newState.nodes, 
        [key]: defaults, 
      }
    }
}

function  getSubDefaults(){
    
}


function setNodeRel<S>(state:S, baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
    const newRels = [...state.nodes[baseId].rel[relId], subId]
    return {...state, 
      nodes: {
        ...state.nodes, 
        [baseId]: {
          ...state.nodes[baseId], 
          rel: {
            ...state.nodes[baseId].rel, 
            [relId]: newRels 
          } 
        } 
      }
    }
}

function delNodeRel<S>(state:S, baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
    return {...state, 
      nodes: {
        ...state.nodes, 
        [baseId]: {
          ...state.nodes[baseId], 
          rel: {
            ...state.nodes[baseId].rel, 
            [relId]: [...state.nodes[baseId].rel[relId].filter((key:Types.NodeId)=> key != subId)] 
          } 
        } 
      }
    }
}

function moveNodeRel<S>(state:S, oldBaseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId, newBaseId: Types.NodeId){
    return {...state, 
      nodes: {
        ...state.nodes, 
        [oldBaseId]: {
          ...state.nodes[oldBaseId], 
          rel: {
            ...state.nodes[oldBaseId].rel, 
            [relId]: [...state.nodes[oldBaseId].rel[relId].filter((key:Types.NodeId)=> key != subId)] 
          } 
        },
        [newBaseId]: {
          ...state.nodes[newBaseId], 
          rel: {
            ...state.nodes[newBaseId].rel, 
            [relId]: [...state.nodes[newBaseId].rel[relId], subId] 
          } 
        },
      }
    }
}

function setNodeChild<S>(state:S, baseId: Types.NodeId, subId: Types.NodeId){
    setNodeRel(state, baseId, 'child', subId)
}
function delNodeChild<S>(state:S, baseId: Types.NodeId, subId: Types.NodeId){
    delNodeRel(state, baseId, 'child', subId)
}
function moveChildFromPath<S>(state:S, path: Types.NodePath, newParent: Types.NodeId): Types.ChkFlowDefault{
    setNodeChild(state, newParent, path[path.length - 1] )
    delNodeChild(state, path[path.length - 2], path[path.length - 1] )
}

function moveUnderPreviousNode<S>(state:S, path: Types.NodePath){
    const thisNodeRelation = getRelation(state, path)
    const thisNodeIndex = state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
    // console.log('move child fn', thisNodeRelation, thisNodeIndex, path)
    if (thisNodeIndex > 0){
      const previousNodeId = state.nodes[path[path.length - 2]].rel[thisNodeRelation][thisNodeIndex - 1]
      // console.log('move child fn', previousNodeId)
      return moveNodeRel(state, path[path.length-2], thisNodeRelation, path[path.length-1], previousNodeId)
    }else{
      return null;
    }
}

function moveUnderParent<S>(state:S, path:Types.NodePath){
  if (path.length > 2 ){
    let currentNode = R.last(path) as string
    let parentNode = path[path.length - 2]
    let grandParentNode = path[path.length - 3]
    let uncles = state.nodes[grandParentNode].rel[state.environment.rel]
    let parentPosition = uncles.indexOf(parentNode)
    let newUncles = [...uncles]
    newUncles.splice(parentPosition + 1, 0, currentNode)
    let delState = delNodeRel(state, parentNode,state.environment.rel, currentNode)
    // console.log('newUncles', uncles, newUncles, parentNode, parentPosition, state.nodes[grandParentNode], delState.nodes[grandParentNode])
    // let addState = setNodeRel(delState, grandParentNode, state.environment.rel, currentNode)
    return {
      ...delState,
      nodes: {
        ...delState.nodes,
        [grandParentNode]: {
          ...delState.nodes[grandParentNode],
          rel: {
            ...delState.nodes[grandParentNode].rel,
            [delState.environment.rel]: newUncles
          }
        }
      }
    }
  }else{
    return null;
  }
}


function buildChildSubtree(nodes: any, node:any){
    return buildSubtree(nodes, node, 'child');
}

function buildSubtree(nodes: any, node: any, rel: string){
    function subTreeHelper(nodes: any, node: any, rel: string){
        let obj: any = {}
        nodes[node].rel[rel].forEach((element: any) => {
            obj[element] = subTreeHelper(nodes, element, rel)
        });    
        return obj;
    }
    return {[node]: subTreeHelper(nodes, node, rel)};
}

function delArrayPrefix(a1original: any[], a2original: any[]){
    let a1 = [...a1original]
    let a2 = [...a2original]
    let elem1 = null;
    let elem2 = null;
    while( elem1 !== undefined && elem2 !== undefined){
        if (elem1 != elem2){
            return null;
        }
        elem1 = a1.shift();
        elem2 = a2.shift();
    }
    if (elem2 !== undefined){
      return [elem2, ...a2];
    }else{
      if (elem1 == undefined){
        return [];
      }else{
        return null;
      }
    }
}

function getSubs<S>(state: S, nodeId: Types.NodeId){
    if (state.nodes[nodeId].rel === undefined){
        console.log('get sub', nodeId, state.nodes[nodeId], state.nodes[nodeId].rel)
        return null;
    }
    return state.nodes[nodeId].rel[state.environment.rel]
}

function getLastLastDescendent<S>(state: S, path:Types.NodePath):Types.NodePath{
  if(path.length < 1){
    return path
  }else{
    let curr = R.last(path) as string
    let children = state.nodes[curr].rel[state.environment.rel]
    if (children.length > 0){
      let lastChild = R.last(children)
      return getLastLastDescendent(state, [...path, lastChild])  
    }else{
      return path
    }
  }
}

function getLastLastVisibleDescendent<S>(state: S, path:Types.NodePath):Types.NodePath{
  if(path.length < 1){
    return path
  }else{
    let curr = R.last(path) as string
    let children = state.nodes[curr].rel[state.environment.rel]
    if (children.length > 0 && !isCollapsed(state, path)){
      let lastChild = R.last(children)
      return getLastLastVisibleDescendent(state, [...path, lastChild])  
    }else{
      return path
    }
  }
}

function isCollapsed(state: Types.ChkFlowDefault, path: Types.NodePath): boolean {
  let node = R.last(path) as string;
  if(node){
    console.log('state.nodes[node]',state.nodes[node])
    return state.nodes[node].isCollapsed;
  }else{
    throw new Error("bad path");
  }
}

function getVisuallyNextNodePath<S>(state: S, path: Types.NodePath):Types.Maybe<Types.NodePath>{
    console.log('params - next',state, path)

    let returnPath: Types.NodePath = [...path]

    let lastWorkingNode;
    let currentWorkingNode = returnPath.pop() as Types.NodeId;
    let currentSubs = getSubs(state, currentWorkingNode)
    console.log('subs', currentSubs, currentWorkingNode, isCollapsed(state, path))
    returnPath = [...returnPath, currentWorkingNode, currentSubs[0]]
    if (currentSubs.length > 0 && !isCollapsed(state, path)){

        return maybeVisible(state, returnPath)
    }else{
        while (returnPath.length > 0){
            lastWorkingNode = currentWorkingNode;
            console.log(returnPath)
            currentWorkingNode = returnPath.pop() as Types.NodeId;
            currentSubs = getSubs(state, currentWorkingNode);
            console.log('subs', 
              currentSubs, 
              currentWorkingNode, 
              currentSubs.indexOf(lastWorkingNode), 
              currentSubs.length - 1, 
              currentSubs.indexOf(lastWorkingNode) < (currentSubs.length - 1) )
            if (currentSubs.indexOf(lastWorkingNode) < (currentSubs.length - 1)){
              let nextNodeDown = currentSubs[currentSubs.indexOf(lastWorkingNode) + 1]
              returnPath = [...returnPath, currentWorkingNode, nextNodeDown]
              return maybeVisible(state, returnPath)
            }
        }
        return new Types.Nothing();
    }


}

function getVisuallyPreviousNodePath<S>(state: S, path: Types.NodePath):Types.Maybe<Types.NodePath>{
  console.log('params - prev',state, path)
  let currPath: Types.NodePath = [...path]
  let currWorkingNode = currPath.pop();
  if (!R.last(currPath)){
    return new Types.Nothing();
  }
  let currSibs = state.nodes[R.last(currPath) as string].rel[state.environment.rel];
  console.log('sibs', currSibs, currWorkingNode, currSibs.indexOf(currWorkingNode))
  let maybeReturnNode: Types.Maybe<Types.NodePath>;
  if (currSibs.indexOf(currWorkingNode) > 0){
    maybeReturnNode = maybeVisible(state, getLastLastVisibleDescendent(state, [...currPath, currSibs[currSibs.indexOf(currWorkingNode) - 1]]))
    if (maybeReturnNode){
      return maybeReturnNode
    }else{
      return maybeVisible(state, maybeReturnNode)
    }
  }
  else{
    maybeReturnNode =  maybeVisible(state, currPath)
    if(!maybeReturnNode.empty){
      return getVisuallyPreviousNodePath(state, maybeReturnNode.content)
    }else{
      return new Types.Nothing()
    }
  }
}

function maybeVisible<S>(state: S, path: Types.NodePath): Types.Maybe<Types.NodePath>{
  let rootPath = state.environment.rootPath;
  let rootPathRemainder = delArrayPrefix(rootPath, path);
  // console.log('result', path)
  if(rootPathRemainder !== null){
      return new Types.Just(path)
  }else{
      return new Types.Nothing();
      // throw new Error("Path should match root path, or else all children are invisible")
  }
}


function newChildUnderThisNode<S>(state: S, path: Types.NodePath){
  // console.log('new child fn',state.nodes)
    const thisNodeRelation = getRelation(state, path)
    const newSubId = getNewId(state);
    const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
    if (path.length > 1){
      const thisNodeIndex = state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
      let newArr = [...state.nodes[path[path.length - 2]].rel[thisNodeRelation]]
        newArr.splice(thisNodeIndex + 1, 0, newSubId)
        return [ newSubId, {...state,
          nodes: {...state.nodes,
            [newSubId]: defaults,
            [path[path.length - 2]]: {
              ...state.nodes[path[path.length - 2]],
              rel: {
                ...state.nodes[path[path.length - 2]].rel,
                [thisNodeRelation] : newArr
              }
            }
          }
        }]
      }else{
        return [ newSubId, {...state,
          nodes: {...state.nodes,
            [newSubId]: defaults,
          }
        }]
      }
}


  function getSubRelations<S>(state: S, id: Types.NodeId){
    let newState = {...state};
    let rels : {[key:string]: Types.NodeId} = {};
    if (state.nodes[id] === undefined ){
      console.error('id', id);
      console.error('state', state)
      throw('node DNE')
    }
    // console.log('this node rels',id, that.state.nodes[id], this.state.nodes);
    Object.keys(state.nodes[id].rel).forEach((currentRel: Types.NodeId) => {
      // console.log('rels for this type',that.state.nodes[id].rel[currentRel])
      newState.nodes[id].rel[currentRel].forEach((currentNode: Types.NodeId)=>{
        rels[currentNode] = currentRel;
      })
    });
    // console.log('result',rels)
    return rels;
  }
  function getTotalSubRelations<S>(state: S, id:Types.NodeId){
    return Object.keys(getSubRelations(state, id)).length
  }





function getNewId(state: S):Types.GeneratedId{
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
    while( state.nodes[key] !== undefined || Types.RESERVED_IDS.includes(key as Types.ReservedId) ){
        let key = makeid(5);
    }
    return key as Types.GeneratedId
}




function  placeCursorFromBeginning(element: HTMLDivElement, offset: number = 0): void {
  element.focus()
  let range = document.createRange()
  let selection = window.getSelection()
  if (element.children.length > 0 ){
      if (element.children[0].nodeType == Node.TEXT_NODE){
          range.setStart(element.childNodes[0], offset )
      }else{
          let textNode = document.createTextNode('');
          element.insertBefore(textNode, element.children[0]);
      }
  }else{
      let textNode = document.createTextNode('');
      element.appendChild(textNode)
      range.setStart(element.childNodes[0], offset )
  }
  range.collapse(false)
  if (selection){
      selection.removeAllRanges()
      selection.addRange(range)
  }
}

function placeCursorFromEnd(element: HTMLDivElement, offset: number = 0): void {
  // https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
  element.focus()
  let range = document.createRange()
  let selection = window.getSelection()
  if (element.children.length > 0 ){
      if (element.children[0].nodeType == Node.TEXT_NODE){
          range.setStart(element.childNodes[0], offset )
      }else{
          let textNode = document.createTextNode('');
          element.insertBefore(textNode, element.children[0]);
      }
  }else{
      let textNode = document.createTextNode('');
      element.appendChild(textNode)
      range.setStart(element.childNodes[0], offset )
  }
  range.collapse(false)
  if (selection){
      selection.removeAllRanges()
      selection.addRange(range)
  }
}

function getNodeTailFromPath(path: Types.NodePath): HTMLDivElement{
  return getNodeFromPath(path).querySelector('.node-tail') as HTMLDivElement
}
function getNodeFromPath(path: Types.NodePath): HTMLDivElement{
  let id = R.last(path) as string;
  if(id){
      let node = document.getElementById(id) as HTMLDivElement;
      if (node){
          return node;
      }else{
          console.log(node);
          console.log(id)
          throw new Error("no element with id... how did this happen?")
      }
  }else{
      throw new Error("id is bad... how did this happen?")
  }
}

export {
  placeCursorFromBeginning,
  placeCursorFromEnd,
  getNodeTailFromPath,
  getVisuallyNextNodePath,
  getVisuallyPreviousNodePath,
  getNewId,
  getNodeIdFromString,
  getNodePathFromStringArray,
  buildSubtree,
  buildChildSubtree,
  delArrayPrefix,
  newChildUnderThisNode,
  setRelation,
  getRelation,
  newChild,
  getSubRelations,
  newSubWithoutRelUsingKey,
  moveUnderPreviousNode,
  moveChildFromPath,
  setNodeRel,
  getRootPaths,
  moveUnderParent,
  lastFromPath
}