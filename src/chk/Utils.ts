import * as Types from './types.d' 
import * as R from 'ramda'
import { Maybe } from 'purify-ts/Maybe'


function pathValid(state:Types.ChkFlowState, path: Types.NodePath ): Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? Maybe.of(path) : Maybe.empty()
  }else{
      return Maybe.empty()
  }
}

function pathVisible(state:Types.ChkFlowState, path: Types.NodePath ):  Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? Maybe.of(path) : Maybe.empty()
  }else{
      return Maybe.empty()
  }
}

function pathCollapsed(state:Types.ChkFlowState, path: Types.NodePath ):  Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    return state.nodes[nodeElem.id] !== undefined ? Maybe.of(path) : Maybe.empty()
  }else{
      return Maybe.empty()
  }
}

function pathCurrentLast(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.PathElem>{
  return pathCurrent(state, path).map(x => R.last(x) as Types.PathElem)
}


function pathCurrent(state:Types.ChkFlowState, path: Types.NodePath ):  Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 0){
    const nodeElem = path[path.length - 1] as Types.PathElem
    let pathCopy = [...path]
    if (pathCopy[0] !== undefined){
      return state.nodes[nodeElem.id] !== undefined ? Maybe.of(pathCopy as Types.NodePath) : Maybe.empty()
    }else{
      return Maybe.empty()
    }
}else{
      return Maybe.empty()
  }
}
function pathParent(state:Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 1){
      const nodeElem = path[path.length - 2] as Types.PathElem
      let pathCopy = [...path]
      pathCopy.pop()
      if (pathCopy[0] !== undefined){
        return state.nodes[nodeElem.id] !== undefined ? Maybe.of(pathCopy as Types.NodePath) : Maybe.empty()
      }else{
        return Maybe.empty()
      }
  }else{
    return Maybe.empty()
  }
}
function pathGrandparent(state:Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath> {
  if (path !== undefined && path.length > 2){
    const nodeElem = path[path.length - 3] as Types.PathElem
    let pathCopy = [...path]
    pathCopy.pop()
    pathCopy.pop() // that's why the grandparents are called "pop-pop" sometimes
    if (pathCopy[0] !== undefined){
      return state.nodes[nodeElem.id] !== undefined ? Maybe.of(pathCopy as Types.NodePath) : Maybe.empty()
    }else{
      return Maybe.empty()
    }
}else{
    return Maybe.empty()
  }
}


function delNodeRel(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.ChkFlowState>{
  return pathCurrent(state, path).chain( (x: Types.NodePath) =>{
    return pathParent(state, path).map( (y: Types.NodePath) =>{
      let x_last = R.last(x) as Types.PathElem
      let y_last = R.last(y) as Types.PathElem
      console.log(x_last)
      console.log(y_last)
      return {...state, 
        nodes: {
          ...state.nodes, 
          [y_last.id]: {
            ...state.nodes[y_last.id], 
            rel: {
              ...state.nodes[y_last.id].rel, 
              [x_last.rel]: [...state.nodes[y_last.id].rel[x_last.rel].filter((key:Types.NodeId)=> key != x_last.id)] 
            } 
          } 
        }
      } 
    })
  }) as Maybe<Types.ChkFlowState>
}

function moveNodeRel(state: Types.ChkFlowState, oldPath: Types.NodePath, newPath: Types.NodePath): Maybe<Types.ChkFlowState>{
  console.log('moveFromTo', oldPath, newPath)
  let changedState = pathCurrentLast(state, oldPath).chain( last => {
    return delNodeRel(state, oldPath).chain( (delState : Types.ChkFlowState) =>{
      console.log(delState)
      return newRel(delState, [...newPath, last])
    })  
  })
  return changedState
}

function newRel(state:Types.ChkFlowState, path: Types.NodePath): Maybe<Types.ChkFlowState>{

  return pathCurrent(state, path).chain( x =>{
    return pathParent(state, path).map( y =>{
      let x_last = R.last(x) as Types.PathElem //Making sure this is possible in pathCurrent
      let y_last = R.last(y) as Types.PathElem //Making sure this is possible in pathParent
      console.log(x_last)
      console.log(y_last)
    
      return {...state,
        nodes: {
          ...state.nodes, 
          [y_last.id]: {
            ...state.nodes[y_last.id], 
            rel: {
              ...state.nodes[y_last.id].rel, 
              [x_last.rel]: [...state.nodes[y_last.id].rel[x_last.rel], x_last.id] 
            } 
          },
        }
      }
    })
  })
}




function moveUnderPreviousNode(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.ChkFlowState>{
  return getOlderSibling(state, path).chain(x => { console.log('older sib', x); return moveNodeRel(state, path, x)})
 
}
  // return pathCurrent(state, path).chain( x => {
  //   return pathParent(state, path).chain ( y => {
  //     let x_last = R.last(x) as Types.PathElem //Making sure this is possible in pathCurrent
  //     let y_last = R.last(y) as Types.PathElem //Making sure this is possible in pathParent

  //     const thisNodeIndex = state.nodes[y_last.id].rel[x_last.rel].indexOf(x_last.id)
  //     const maybePreviousNodeId: Maybe<Types.NodeId> = thisNodeIndex > 0 ? Maybe.of(state.nodes[y_last.id].rel[x_last.rel][thisNodeIndex - 1]) : Maybe.empty()
  //     let newPath: Types.NodePath = [...path]
  //     return maybePreviousNodeId.chain( (z: Types.NodeId) => { newPath[newPath.length-1].id = z; return moveNodeRel(state, path, newPath )}) 
  //   })
  // })

function moveUnderParent(state: Types.ChkFlowState, path:Types.NodePath): Maybe<Types.ChkFlowState>{
    let maybeCurrPath = pathCurrent(state, path)
    return maybeCurrPath.chain( current => {
      return pathParent(state, path).chain( parent => {
        return pathGrandparent(state, path).chain(x => maybeChildrenVisible(state, x)).chain ( grandparent => {
          let current_last = R.last(current) as Types.PathElem //Making sure this is possible in pathCurrent
          let parent_last = R.last(parent) as Types.PathElem //Making sure this is possible in pathParent
          let grandparent_last = R.last(grandparent) as Types.PathElem //Making sure this is possible in pathParent
              let uncles = state.nodes[grandparent_last.id].rel[parent_last.rel]
          let parentPosition = uncles.indexOf(parent_last.id)
          let newUncles = [...uncles]
          newUncles.splice(parentPosition + 1, 0, current_last.id)
          return delNodeRel(state, path).map( (delState: Types.ChkFlowState) => {
            return {
              ...delState,
              nodes: {
                ...delState.nodes,
                [grandparent_last.id]: {
                  ...delState.nodes[grandparent_last.id],
                  rel: {
                    ...delState.nodes[grandparent_last.id].rel,
                    [parent_last.rel]: newUncles
                  }
                }
              }
            }  
          })
        })
      })
    })
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

function getSubs(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath[]>{
  return pathCurrent(state, path).chain( curr => {
    let curr_last = R.last(curr) as Types.PathElem //Making sure this is possible in pathParent
    let subarray = Object.keys(state.nodes[curr_last.id].rel).filter((id: Types.NodeId)=> state.nodes[id] !== undefined || id == 'child').map((childRel: Types.NodeId, index: number) => {
      return state.nodes[curr_last.id].rel[childRel].filter( (childRelElem: Types.NodeId)=> state.nodes[childRelElem] !== undefined ).map((childId: Types.NodeId, index: number)=> {
        return ([...path, {rel: childRel,id: childId}] as Types.NodePath) 
      }) 
    }).flat()
    return Maybe.fromPredicate( x => x.length > 0, subarray)
  })
}



function getLastLastVisibleDescendent(state: Types.ChkFlowState, path:Types.NodePath):Maybe<Types.NodePath>{
  if(path.length < 1){
    return Maybe.empty()
  }else{
    return getSubs(state, path).caseOf({ 
      Just: (y: Types.NodePath[]) => {
        console.log('subs',y)
        if (y.length > 0 && isNotCollapsed(state, path).isJust()){
          return Maybe.of(getLastLastVisibleDescendent(state, y[y.length - 1]).orDefault(y[y.length - 1]))
        }else{
          return Maybe.of(path)
        }
      },
      Nothing: () => Maybe.of(path)
    })
  }
}

function isNotCollapsed(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath> {
  return pathCurrent(state, path).chain( x => {
    let x_last = R.last(x) as Types.PathElem //Making sure this is possible in pathParent
    return state.nodes[x_last.id].isCollapsed ? Maybe.empty() : Maybe.of(path);
  })
}

function getYoungerSibling(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath>{
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop();
  if (pathInit.length > 0){
    return getSubs(state, pathInit).chain<Types.NodePath>( (siblingPaths: Types.NodePath[] ) => {
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

      return nextPath ? Maybe.of<Types.NodePath>(nextPath) : Maybe.empty();
    });  
  }else{
    return Maybe.empty()
  }
}

function getOlderSibling(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath>{
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop();
  return getSubs(state, pathInit).chain((siblingPaths: Types.NodePath[] ) => {
    var lastPath: Types.NodePath = siblingPaths[0];
    let olderSibPath: Types.NodePath = siblingPaths[0];
    siblingPaths.forEach((siblingPath: Types.NodePath, index: number )=>{
      if ( R.equals(path, siblingPath) ){
        olderSibPath = lastPath;
      }
      lastPath = siblingPath;
    });
    return Maybe.fromPredicate(x => !R.equals(x, path) , olderSibPath) ;
  });
}

declare function _<T>(): T
function getVisuallyNextNodePath(state: Types.ChkFlowState, path: Types.NodePath):Maybe<Types.NodePath>{
  let maybeFirstChild = pathCurrent(state, path).chain( x => {
    let maybeSubsAndNotCollapsed : Maybe<Types.NodePath[]> =  getSubs(state, path).filter( _ => isNotCollapsed(state, path).isJust() ) 
    return maybeSubsAndNotCollapsed.chain( (subs: Types.NodePath[]) => {
      return Maybe.fromPredicate((x) => subs.length > 0, subs).map( x => x[0]);
    })
  })
  return maybeFirstChild.caseOf({
    Just: x => Maybe.of(x),
    Nothing:()=> getYoungerSibling(state, path).caseOf({
      Just: x => Maybe.of(x),
      Nothing: () => getFirstYoungerUncle(state, path).filter( x => maybeVisible(state, x).isJust() )
    })
  })
}

function getFirstYoungerUncle(state: Types.ChkFlowState, path: Types.NodePath):Maybe<Types.NodePath>{
  return pathParent(state, path).chain( x => getYoungerSibling(state, x ).caseOf({
    Just: y => Maybe.of(y),
    Nothing: () => getFirstYoungerUncle(state, x)
  }))
}



function getVisuallyPreviousNodePath(state: Types.ChkFlowState, path: Types.NodePath):Maybe<Types.NodePath>{
  // console.log('params - next',state, path)
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop()
  let maybeOlderSibling = getOlderSibling(state, path)
  return maybeOlderSibling.caseOf({
    Just: sib => isNotCollapsed(state, sib).caseOf({
      Just: x => getLastLastVisibleDescendent(state, x).caseOf({
        Just: y => Maybe.of(y),
        Nothing: () => Maybe.of(x)
      }), 
      Nothing: () => Maybe.of(sib)
    }),
    Nothing: () => maybeVisible(state, pathInit)
  })
}

function maybeVisible(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath>{
  let rootPath = state.environment.homePath;
  let visual_path = [...path]
  visual_path.pop();
  let rootPathRemainder = delArrayPrefix(rootPath, visual_path);
  console.log('maybeVisible - result - ', path, rootPathRemainder)
  if(rootPathRemainder !== null){
      return Maybe.of(path)
  }else{
      return Maybe.empty();
      // throw new Error("Path should match root path, or else all children are invisible")
  }
}


function maybeChildrenVisible(state: Types.ChkFlowState, path: Types.NodePath): Maybe<Types.NodePath>{
  let rootPath = [...state.environment.homePath];
  rootPath.pop();
  let visual_path = [...path]
  visual_path.pop();
  let rootPathRemainder = delArrayPrefix(rootPath, visual_path);
  console.log('maybeVisible - result - ', path, rootPathRemainder)
  if(rootPathRemainder !== null){
      return Maybe.of(path)
  }else{
      return Maybe.empty();
      // throw new Error("Path should match root path, or else all children are invisible")
  }
}



function newChildUnderThisNode(state: Types.ChkFlowState, path: Types.NodePath): Maybe<[Types.NodePath, Types.ChkFlowState]>{
  //TODO: make new node directly under
  let pathInit: Types.NodePath = [...path]
  let pathLast = pathInit.pop()
  const newSubId = getNewId(state);
  const defaults = { text: '', rel: {'child':[]}, isCollapsed: false  }
  let maybeCurr = pathCurrentLast(state, path)
  let maybeResult = maybeCurr.chain( (current: Types.PathElem) : Maybe<[Types.NodePath, Types.ChkFlowState]> => {
    let maybeResultInner  = pathParent(state, path).map( (parentList: Types.NodePath): [Types.NodePath, Types.ChkFlowState] => {
      // console.log('parent node',parent, path)
      // console.log('current node',current, path)
      let parent = R.last(parentList) as Types.PathElem
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
  Maybe.fromPredicate(_ => isFirstTextNode, Maybe.of(element.children[0])).orDefaultLazy(()=>{
    if (element.children.length <= 0){
      const textNode = document.createTextNode('');
      element.appendChild(textNode)
      return Maybe.of(element.children[0])
    }
    if (element.children[0].nodeType != Node.TEXT_NODE){
      const textNode = document.createTextNode('');
      element.insertBefore(textNode, element.children[0]);
      return Maybe.of(element.children[0])
    }
    return Maybe.empty();
  }).map((textNode)=>{
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
  return pathCurrentLast(state, path)
  .map( (y:Types.PathElem) => document.getElementById(y.id)?.querySelector('.node-tail') as HTMLDivElement)
  .map( (z:HTMLDivElement) => placeCursorFromBeginning(z));
}

function getNodeTailFromPath(state: Types.ChkFlowState, path: Types.NodePath): Maybe<HTMLDivElement>{
  return getNodeFromPath(state, path).chain ( x => Maybe.fromNullable( x.querySelector('.node-tail') as HTMLDivElement ));
}
function getNodeFromPath(state: Types.ChkFlowState, path: Types.NodePath): Maybe<HTMLDivElement>{
  return pathCurrentLast(state, path).chain( x => Maybe.fromNullable( document.getElementById(x.id) as HTMLDivElement ));
}

export {
  focusOnPath,
  placeCursorFromBeginning,
  placeCursorFromEnd,
  getNodeTailFromPath,
  getVisuallyNextNodePath,
  getVisuallyPreviousNodePath,
  delArrayPrefix,
  newChildUnderThisNode,
  getSubs,
  moveUnderPreviousNode,
  moveUnderParent,
  pathCurrent,
  pathCurrentLast,
  pathParent,
  pathGrandparent,
}