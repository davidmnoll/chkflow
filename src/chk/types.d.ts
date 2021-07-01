import React from "react";



interface ChkFlowState<I, E> extends ChkFlowOptions<I,E> {
    nodes: ChkFlowNodes<I>;
    environment: ChkFlowEnvironment<I, E>;
}


/**
 * Default Props for UI elements
 */

type ChkFlowOptions<I, E> = {
    nodeComponent: TreeNodeComponent;
    defaultNodes: ChkFlowNodes<I>;
    defaultEnvironment: ChkFlowEnvironment<I, E>;
    setStateCallback: (state: ChkFlowState<I,E>)=> void;
    showDummies: boolean;
}

type ChkFlowEnvironment<I, E> = {
    homePath: NodePath | NodeRootPath,
    activeNode: NodePath | null
}



/** Node state */
const RESERVED_IDS = ['0'] as const;
type IdTuple = typeof RESERVED_IDS;
type ReservedId = IdTuple[0];
// type ReservedId = "1" | "0" | "child" | "home" | "root"
type NotA<T> = T extends ReservedIds ? never : T
type NotB<T> = ReservedIds extends T ? never : T
type NotReserved<T> = NotA<T> & NotB<T>
type GeneratedId = NotReserved<string>
// type NodeId = GeneratedId | ReservedId
type NodeId = string
type NodeRootPath = ['0']
type NonRootNodePath = [...NodeRootPath,NodeId, ...NodeId[]]
type NodePath = NodeRootPath | ['0', ...NodeId[]]



type ChkFlowNodes<T> = { 
    '0': ChkFlowNode<T>, 
    [nodeId:NodeId]: ChkFlowNode<T>
}


type ChkFlowNode<T> = InfoLeaf<T> | InfoNode<T>

interface InfoLeaf<T> extends BaseNodeInfo<T> {
    rel: {}
}
interface InfoNode<T> extends BaseNodeInfo<T> {
    rel: { 
        [key:NodeId]: NodePath
    }
}
interface BaseNodeInfo<T> extends T{
}



/**Display Components &  Props */

interface TreeNodeProps<I, E> {
    nodePath: NodeId[NodeId];
    children: TreeNodeComponent<I,E>
    nodeInfo: ChkFlowNode<I>;
    activeNode: NodePath;
    setActiveNode: (path:NodePath) => void;
    updateNode: (path: NodePath, data: T) => void;
    setPath: (path: NodePath) => void;
    newChildUnderThisNode: (path: NodePath) => void;
    getRelation: (path:NodePath) => NodeId;
    setRelation: (path:NodePath, rel:NodeId) => void;
    moveChildFromPath: (path:NodePath, newParent: NodeId) => void;
    moveUnderPreviousNode: (path:NodePath) => void;
    moveUnderParent: (path:NodePath) => void;
    toggleCollapse: (path:NodePath) => void;
    newChildUnderThisNode: (path:NodePath) => void;
    moveCursorToVisuallyNextNode: (path:NodePath) => void
    moveCursorToVisuallyPreviousNode: (path:NodePath) => void
}
// interface TreeNodeState<T extends BaseNodeInfo> {

// }


type TreeNodeComponent<I, E> = React.FC<TreeNodeProps<I, E>> | React.Component<TreeNodeProps<I, E>>



/** Extras */

class Nothing {
    empty: true = true;
}


class Just<T> {
    constructor(content: T){
        this.content = content;
    }
    content: T;
    empty: false = false;
}

type Maybe<T> = Just<T> | Nothing;




export {
    Maybe,
    Just,
    Nothing,
    ChkFlowSettings,
    ChkFlowState,
    ChkFlowEnvironment,
    ChkFlowNodes,
    ChkFlowNode,
    TreeNodeProps,
    TreeNodeComponent,
    DefaultNodeInfo,
    NodeId,
    GeneratedId,
    ReservedId,
    IdTuple,
    RESERVED_IDS,
    NodeBasePath,
    NodeRootPath,
    NodePath,
    BaseNodeInfo,
    InfoLeaf,
    InfoNode,
}