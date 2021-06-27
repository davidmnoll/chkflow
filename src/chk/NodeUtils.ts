import * as Types from './types' 
import * as R from 'ramda'
import { Type } from 'typescript';
import { exception } from 'console';
import { stat } from 'fs';


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
}