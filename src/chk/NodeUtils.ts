import * as Types from './types' 
import * as R from 'ramda'
import { Type } from 'typescript';
import { exception } from 'console';
import { stat } from 'fs';



function getRelation(state: Types.ChkFlowState, path: Types.NodeId[]){
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
function setRelation(state: Types.ChkFlowState, path: Types.NodeId[], relation: Types.NodeId){
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
function newChild(state: Types.ChkFlowState, path: Types.NodeId[]){
    return newSub(state, path, 'child')
}

function newSub(state: Types.ChkFlowState, path: Types.NodeId[], relation: Types.NodeId): any {
    const key = getNewId(state)
    return newSubUsingKey(state, key, path, relation)

}

function newSubWithoutRel(state: Types.ChkFlowState): any {
    const key = getNewId(state)
    newSubWithoutRelUsingKey(state, key)
    return key
}

function newSubWithoutRelUsingKey(state: Types.ChkFlowState, key: Types.NodeId): any {
    const defaults = { text: key, rel: {}, isCollapsed: false  }
    return {...state, 
      nodes: {...state.nodes, 
        [key]: defaults, 
      }
    }
}

function newSubUsingKey(state:Types.ChkFlowState, key: Types.NodeId, path: Types.NodeId[], relation: Types.NodeId): any {
    const defaults = { text: key, rel: {}, isCollapsed: false  }
    let newState = setNodeRel(state, path[path.length - 1], relation, key)
    return {...newState, 
      nodes: {...newState.nodes, 
        [key]: defaults, 
      }
    }
}

function  getSubDefaults(){
    
}


function setNodeRel(state:Types.ChkFlowState, baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
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

function delNodeRel(state:Types.ChkFlowState, baseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId ){
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

function moveNodeRel(state:Types.ChkFlowState, oldBaseId: Types.NodeId, relId: Types.NodeId, subId: Types.NodeId, newBaseId: Types.NodeId){
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

function setNodeChild(state:Types.ChkFlowState, baseId: Types.NodeId, subId: Types.NodeId){
    setNodeRel(state, baseId, 'child', subId)
}
function delNodeChild(state:Types.ChkFlowState, baseId: Types.NodeId, subId: Types.NodeId){
    delNodeRel(state, baseId, 'child', subId)
}
function moveChildFromPath(state:Types.ChkFlowState, path: Types.NodeId[], newParent: Types.NodeId){
    setNodeChild(state, newParent, path[path.length - 1] )
    delNodeChild(state, path[path.length - 2], path[path.length - 1] )
}

function moveUnderPreviousNode(state:Types.ChkFlowState, path: Types.NodeId[]){
    const thisNodeRelation = getRelation(state, path)
    const thisNodeIndex = state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
    if (thisNodeIndex !== 0){
      const previousNodeId = state.nodes[path[path.length - 2]].rel[thisNodeRelation][thisNodeIndex - 1]
      moveNodeRel(state, path[path.length-2], thisNodeRelation, path[path.length-1], previousNodeId)
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
        return [];
    }
}

function getSubs(state: Types.ChkFlowState, nodeId: Types.NodeId){
    if (state.nodes[nodeId].rel === undefined){
        console.log('get sub', nodeId, state.nodes[nodeId], state.nodes[nodeId].rel)
        return null;
    }
    return state.nodes[nodeId].rel[state.environment.rel]
}

function getVisuallyNextNodePath(state: Types.ChkFlowState, path: Types.NodeId[]){
    // console.log('params',state, path)

    let returnPath = [...path]

    let lastWorkingNode;
    let currentWorkingNode = returnPath.pop() as Types.NodeId;
    let currentSubs = getSubs(state, currentWorkingNode)
    if (currentSubs.length > 0){
        return throwIfPathIsInvisible(state, [...returnPath, currentWorkingNode, currentSubs[0]])
    }else{
        while (returnPath.length > 0){
            lastWorkingNode = currentWorkingNode;
            currentWorkingNode = returnPath.pop() as Types.NodeId;
            currentSubs = getSubs(state, currentWorkingNode);
            if (currentSubs.indexOf(lastWorkingNode) < (currentSubs.length - 1)){
                let nextNodeDown = currentSubs[currentSubs.indexOf(lastWorkingNode) + 1]
                return throwIfPathIsInvisible(state, [...returnPath, currentWorkingNode, nextNodeDown])
            }
        }
        return null;
    }


}
function throwIfPathIsInvisible(state: Types.ChkFlowState, path: Types.NodeId[]){
    let rootPath = state.environment.rootPath;
    let rootPathRemainder = delArrayPrefix(rootPath, path);
    // console.log('result', path)
    if(rootPathRemainder !== null){
        return path
    }else{
        return null;
        // throw new Error("Path should match root path, or else all children are invisible")
    }
}

function getVisuallyPreviousNodePath(state: Types.ChkFlowState, path: Types.NodeId[]){
    let currPath = [...path]
    let currWorkingNode = currPath.pop();
    let currSibs = state.nodes[R.last(currPath) as string].rel[state.environment.rel];
    if (currSibs.indexOf(currWorkingNode) > 0){
        return throwIfPathIsInvisible(state, [...currPath, currSibs[currSibs.indexOf(currWorkingNode) - 1]])
    }
    else{
        return throwIfPathIsInvisible(state, currPath)
    }
}


 function newChildUnderThisNode(state: Types.ChkFlowState, path: Types.NodeId[]){
    const thisNodeRelation = getRelation(state, path)
    const thisNodeIndex = state.nodes[path[path.length - 2]].rel[thisNodeRelation].indexOf(path[path.length - 1])
    const newSubId = getNewId(state);
    const defaults = { text: newSubId, rel: {}, isCollapsed: false  }
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
  }


  function getSubRelations(state: Types.ChkFlowState, id: Types.NodeId){
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
  function getTotalSubRelations(state: Types.ChkFlowState, id:Types.NodeId){
    return Object.keys(getSubRelations(state, id)).length
  }





function getNewId(state: Types.ChkFlowState):Types.NodeId{
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
    while( state.nodes[key] !== undefined || keywords.includes(key) ){
        let key = makeid(5);
    }
    return key
}

export {
    getVisuallyNextNodePath,
    getVisuallyPreviousNodePath,
    getNewId,
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
    setNodeRel
}