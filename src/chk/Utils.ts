import * as Types from './types.d' 
import * as R from 'ramda'
import * as M from './Maybe'
import * as Tr from './Trace'


function pathValid(state:Types.ChkFlowState, path: Types.NodePath ):  M.Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? new M.Just(path) : new M.Nothing("bad ID: " + JSON.stringify(nodeElem) )
  }else{
      return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}

function pathVisible(state:Types.ChkFlowState, path: Types.NodePath ):  M.Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? new M.Just(path) : new M.Nothing("bad ID: " + JSON.stringify(nodeElem) )
  }else{
      return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}

function pathCollapsed(state:Types.ChkFlowState, path: Types.NodePath ):  M.Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? new M.Just(path) : new M.Nothing("bad ID: " + JSON.stringify(nodeElem) )
  }else{
      return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}


function pathCurrent(state:Types.ChkFlowState, path: Types.NodePath ):  M.Maybe<Types.PathElem> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? new M.Just(nodeElem) : new M.Nothing("bad ID: " + JSON.stringify(nodeElem) )
  }else{
      return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}
function pathParent(state:Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.PathElem> {
  if (path !== undefined && path.length > 1){
      const nodeElem = path[path.length - 2] as Types.PathElem
      return state.nodes[nodeElem.id] !== undefined ? new M.Just(nodeElem) : new M.Nothing("bad ID")
  }else{
    return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}
function pathGrandparent(state:Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.PathElem> {
  if (path !== undefined && path.length > 2){
    const nodeElem = path[path.length - 3] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? new M.Just(nodeElem) : new M.Nothing("bad ID")
  }else{
    return (new M.Nothing("bad path: "+JSON.stringify(path))).throw()
  }
}


function delNodeRel(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.ChkFlowState>{
  return pathCurrent(state, path).handle( (x: Types.PathElem) =>{
    return pathParent(state, path).handle( (y: Types.PathElem) =>{
      return {...state, 
        nodes: {
          ...state.nodes, 
          [y.id]: {
            ...state.nodes[y.id], 
            rel: {
              ...state.nodes[y.id].rel, 
              [x.rel]: [...state.nodes[y.id].rel[x.rel].filter((key:Types.NodeId)=> key != x.id)] 
            } 
          } 
        }
      } 
    })
  }) as M.Maybe<Types.ChkFlowState>
}

function moveNodeRel(state: Types.ChkFlowState, oldPath: Types.NodePath, newPath: Types.NodePath): M.Maybe<Types.ChkFlowState>{
  return delNodeRel(state, oldPath).handle( (delState : Types.ChkFlowState) =>{
    return newRel(delState, newPath)
  }) as M.Maybe<Types.ChkFlowState>
}

function newRel(state:Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.ChkFlowState>{
  return pathCurrent(state, path).handle( (x: Types.PathElem) =>{
    return pathParent(state, path).handle( (y: Types.PathElem) =>{
      return {...state,
        nodes: {
          ...state.nodes, 
          [y.id]: {
            ...state.nodes[y.id], 
            rel: {
              ...state.nodes[y.id].rel, 
              [x.rel]: [...state.nodes[y.id].rel[x.rel], x.id] 
            } 
          },
        }
      }
    })
  }) as M.Maybe<Types.ChkFlowState>
}


function moveUnderPreviousNode(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.ChkFlowState>{ 
  return pathCurrent(state, path).handle( (x: Types.PathElem) => {
    return pathParent(state, path).handle ( (y: Types.PathElem) => {
      const thisNodeIndex = state.nodes[y.id].rel[x.rel].indexOf(x.id)
      const maybePreviousNodeId: M.Maybe<Types.NodeId> = thisNodeIndex > 0 ? new M.Just(state.nodes[y.id].rel[x.rel][thisNodeIndex - 1]) : new M.Nothing()
      let newPath: Types.NodePath = [...path]
      return maybePreviousNodeId.handle( (z: Types.NodeId) => { newPath[newPath.length-1].id = z; moveNodeRel(state, path, newPath )}) as M.Maybe<Types.ChkFlowState>
    }) as M.Maybe<Types.ChkFlowState>
  }) as M.Maybe<Types.ChkFlowState>
}

function moveUnderParent(state: Types.ChkFlowState, path:Types.NodePath): M.Maybe<Types.ChkFlowState>{
    let maybeCurrPath = pathCurrent(state, path)
    return maybeCurrPath.handle( (current:Types.PathElem) => {
      return pathParent(state, path).handle( (parent: Types.PathElem) => {
        return pathGrandparent(state, path).handle ( (grandparent: Types.PathElem) => {
          let uncles = state.nodes[grandparent.id].rel[parent.rel]
          let parentPosition = uncles.indexOf(parent.id)
          let newUncles = [...uncles]
          newUncles.splice(parentPosition + 1, 0, current.id)
          delNodeRel(state, path).handle( (delState: Types.ChkFlowState) => {
            return {
              ...delState,
              nodes: {
                ...delState.nodes,
                [grandparent.id]: {
                  ...delState.nodes[grandparent.id],
                  rel: {
                    ...delState.nodes[grandparent.id].rel,
                    [parent.rel]: newUncles
                  }
                }
              }
            }  
          })
        }) as M.Maybe<Types.ChkFlowState>
      }) as M.Maybe<Types.ChkFlowState>
    }) as M.Maybe<Types.ChkFlowState>
}





function delArrayPrefix(a1original: any[], a2original: any[]){
    let a1 = [...a1original]
    let a2 = [...a2original]
    let elem1 = null;
    let elem2 = null;
    while( elem1 !== undefined && elem2 !== undefined){
        if (!R.equals(elem1, elem2)){
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

function getSubs(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.NodePath[]>{
  return pathCurrent(state, path).handle( (curr: Types.PathElem) => {
    return Object.keys(state.nodes[curr.id].rel).filter((id: Types.NodeId)=> state.nodes[curr.id] !== undefined ).map((childRel: Types.NodeId, index: number) => {
      return state.nodes[curr.id].rel[childRel].map((childId: Types.NodeId, index: number)=> {
        return ([...path, {rel: childRel,id: childId}] as Types.NodePath) 
      }) 
    }).flat() 
  })
}



function getLastLastVisibleDescendent(state: Types.ChkFlowState, path:Types.NodePath):M.Maybe<Types.NodePath>{
  if(path.length < 1){
    return new M.Nothing()
  }else{
    return getSubs(state, path).handle( (y: Types.NodePath[]) => {
      console.log('subs',y)
      if (y.length > 0 && isNotCollapsed(state, path).dump()){
        return getLastLastVisibleDescendent(state, y[y.length - 1])
      }else{
        return path
      }
    }) as M.Maybe<Types.NodePath>
  }
}

function isNotCollapsed(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<boolean> {
  return pathCurrent(state, path).handle((x: Types.PathElem) => {
    return !state.nodes[x.id].isCollapsed;
  })
}

function getYoungerSibling(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.NodePath>{
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop();
  if (pathInit.length > 0){
    return getSubs(state, pathInit).handleMaybe<Types.NodePath>( (siblingPaths: Types.NodePath[] ) => {
      let next = false;
      let nextPath: Types.NodePath | null = null;
      siblingPaths.forEach((siblingPath: Types.NodePath, index: number )=>{
        if (next){
          nextPath = siblingPath;
          next = false;
        }
        if (R.equals(path, siblingPath) ){
          next = true;
        }
      });
      if (!nextPath){
        console.log('no younger sib --- no path later than <<',path,'>> found in: <<', siblingPaths,'>>')
      }

      return (nextPath ? new M.Just<Types.NodePath>(nextPath) : new M.Nothing("did not find younger sibling"));
    });  
  }else{
    return new M.Nothing("younger sibling of empty path")
  }
}

function getOlderSibling(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.NodePath>{
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop();
  return getSubs(state, pathInit).handleMaybe((siblingPaths: Types.NodePath[] ) => {
    var lastPath: Types.NodePath;
    let olderSibPath: Types.NodePath | null = null;
    siblingPaths.forEach((siblingPath: Types.NodePath, index: number )=>{
      lastPath = siblingPath;
      if ( R.equals(path, siblingPath) ){
        olderSibPath = lastPath;
      }
    });
    return (olderSibPath ? new M.Just<Types.NodePath>(olderSibPath) : new M.Nothing("did not find younger sibling")) ;
  });
}


function getVisuallyNextNodePath(state: Types.ChkFlowState, path: Types.NodePath):M.Maybe<Types.NodePath>{
  // console.log('params - next',state, path)
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop()
  return pathCurrent(state, path).handleMaybe( (current: Types.PathElem) => {
    let maybeSubsAndNotCollapsed : M.Maybe<Types.NodePath[]>=  getSubs(state, path).if(isNotCollapsed(state, path).dump()) 
    return maybeSubsAndNotCollapsed.handleMaybe( (subs: Types.NodePath[]) => {
      return subs[0] ? new M.Just(subs[0]) : new M.Nothing("no subs");
    }).else(()=>{
      if (pathInit.length > 0){
        return getYoungerSibling(state, path)
          .handleMaybe( (youngerSibPath: Types.NodePath) => 
            maybeVisible(state, youngerSibPath)
            .else(()=>
              getVisuallyNextNodePath(state, youngerSibPath)))
          .else(()=>{
            return getYoungerSibling(state, pathInit).handleMaybe( (x: Types.NodePath) => maybeVisible(state, x))
          })
      }else{
        return new M.Nothing("trying to get next of empty path")
      }
    })
  })
}


function getVisuallyPreviousNodePath(state: Types.ChkFlowState, path: Types.NodePath):M.Maybe<Types.NodePath>{
  // console.log('params - next',state, path)
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop()
  let maybeOlderSibling = getOlderSibling(state, path)
  if (maybeOlderSibling.empty){
    return new M.Just(pathInit)
  }else{
    return maybeOlderSibling.handle( (sib: Types.NodePath) => {
      console.log(sib)
      if (!isNotCollapsed(state, sib).dump()){
        return sib
      }
      const sib_last_desc = getLastLastVisibleDescendent(state, sib) 
      return sib_last_desc.empty ? getVisuallyPreviousNodePath(state, sib) : sib_last_desc 
    }) as M.Maybe<Types.NodePath>
  }
  
}

function maybeVisible(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<Types.NodePath>{
  let rootPath = state.environment.homePath;
  let rootPathRemainder = delArrayPrefix(rootPath, path);
  // console.log('result', path)
  if(rootPathRemainder !== null){
      return new M.Just(path)
  }else{
      return new M.Nothing();
      // throw new Error("Path should match root path, or else all children are invisible")
  }
}


function newChildUnderThisNode(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<[Types.NodePath, Types.ChkFlowState]>{
  //TODO: make new node directly under
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop()
  const newSubId = getNewId(state);
  const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
  let maybeCurr = pathCurrent(state, path)
  let maybeResult = maybeCurr.handleMaybe( (current: Types.PathElem) : M.Maybe<[Types.NodePath, Types.ChkFlowState]> => {
    let maybeResultInner  = pathParent(state, path).handle( (parent: Types.PathElem): [Types.NodePath, Types.ChkFlowState] => {
      // console.log('parent node',parent, path)
      // console.log('current node',current, path)
      const thisNodeIndex = state.nodes[parent.id].rel[current.rel].indexOf(current.id)
      let newArr = [...state.nodes[parent.id].rel[current.rel]]
      newArr.splice(thisNodeIndex + 1, 0, newSubId)
      return [ [...pathInit, {id: newSubId, rel: current.rel}], {...state,
        nodes: {...state.nodes,
          [newSubId]: defaults,
          [parent.id]: {
            ...state.nodes[parent.id],
            rel: {
              ...state.nodes[parent.id].rel,
              [current.rel] : newArr
            }
          }
        }
      }]
    })
    return maybeResultInner
  })
  return maybeResult
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
    while( state.nodes[key] !== undefined || keywords.includes(key as Types.NodeId) ){
        key = makeid(5);
    }
    return key as Types.NodeId
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
  const isFirstTextNode = (element.children.length > 0 && element.children[0].nodeType == Node.TEXT_NODE )
  M.isMaybeIf<Element>(element.children[0], isFirstTextNode).else(()=>{
    if (element.children.length <= 0){
      const textNode = document.createTextNode('');
      element.appendChild(textNode)
      return new M.Just(element.children[0])
    }
    if (element.children[0].nodeType != Node.TEXT_NODE){
      const textNode = document.createTextNode('');
      element.insertBefore(textNode, element.children[0]);
      return new M.Just(element.children[0])
    }
    return new M.Nothing("couldn't find text node");
  }).handle((textNode : Element)=>{
    const range = document.createRange()
    const selection = window.getSelection()  
    range.setStart(textNode, offset )
    range.collapse(false)
    if (selection){
        selection.removeAllRanges()
        selection.addRange(range)
    }
    element.focus()
  })
}

function focusOnPath(state: Types.ChkFlowState, path: Types.NodePath){
  return pathCurrent(state, path)
  .handle( (y:Types.PathElem) => document.getElementById(y.id)?.querySelector('.node-tail') as HTMLDivElement).throw("no element with id")
  .handle( (z:HTMLDivElement) => placeCursorFromBeginning(z)).throw("no node tail");
}

function getNodeTailFromPath(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<HTMLDivElement>{
  return getNodeFromPath(state, path).handle ( (x:HTMLDivElement) => x.querySelector('.node-tail') as HTMLDivElement);
}
function getNodeFromPath(state: Types.ChkFlowState, path: Types.NodePath): M.Maybe<HTMLDivElement>{
  return pathCurrent(state, path).handle( (x: Types.PathElem) => document.getElementById(x.id) as HTMLDivElement );
}

export {
  focusOnPath,
  placeCursorFromBeginning,
  placeCursorFromEnd,
  getNodeTailFromPath,
  getVisuallyNextNodePath,
  getVisuallyPreviousNodePath,
  getNewId,
  delArrayPrefix,
  newChildUnderThisNode,
  getSubs,
  moveUnderPreviousNode,
  moveUnderParent,
  pathCurrent,
  pathParent,
  pathGrandparent,
}