import React from "react";
import { Types } from "./ChkFlow";
import { 
    trace,
    traceBreak,
    traceFunc,
    traceQuiet
} from "./Utils"



interface ChkFlowState extends ChkFlowOptions {
    nodes: ChkFlowNodes;
    environment: ChkFlowEnvironment;
}


/**
 * Default Props for UI elements
 */

type ChkFlowOptions = {
    nodeComponent: TreeNodeComponent;
    containerComponent: ContainerComponent;
    defaultNodes: ChkFlowNodes;
    defaultEnvironment: ChkFlowEnvironment;
    setStateCallback: (state: ChkFlowState)=> void;
    showDummies: boolean;
}

type ChkFlowEnvironment = {
    homePath: NodePath,
    activeNode: NodePath | null
}



type NodeId = string
type PathElem = {rel: string, id: NodeId}
type NodePath = [PathElem, ...PathElem[]]



type ChkFlowNodes = { 
    '0': ChkFlowNode, 
    [nodeId:string]: ChkFlowNode
}


interface ChkFlowNode extends BaseNodeInfo{
    rel: { 
        [key:string]: NodeId[]
    },
}

interface BaseNodeInfo {
    text: string,
    isCollapsed: boolean
}


/**Display Components &  Props */

interface TreeNodeProps {
    nodePath: NodePath;
    children: TreeNodeComponent[];
    nodeInfo: ChkFlowNode;
    pathElem: PathElem;
    activeNode: NodePath;
    setActiveNode: (path:NodePath) => void;
    updateNode: (path: NodePath, data: ChkFlowNode) => void;
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

interface ContainerProps {
    environment: ChkFlowEnvironment;
    nodes: ChkFlowNodes;
    children: TreeNodeComponent[];
    setPath: (path: NodePath) => void;
    resetNodes: () => void;
}


type TreeNodeComponent = React.FC<TreeNodeProps> | React.Component<TreeNodeProps>
type ContainerComponent = React.FC<ContainerProps> | React.Component<ContainerProps>





export type {
    ChkFlowState,
    ChkFlowEnvironment,
    ChkFlowNodes,
    ChkFlowNode,
    TreeNodeProps,
    ContainerProps,
    ContainerComponent,
    TreeNodeComponent,
    NodeId,
    PathElem,
    NodePath,
    BaseNodeInfo,
}