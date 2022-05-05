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
    execWindowComponent?: ExecWindowComponent;
    defaultNodes: ChkFlowNodes;
    defaultEnvironment: ChkFlowEnvironment;
    setStateCallback: (state: ChkFlowState)=> void;
    showDummies: boolean;
    execEnabled: boolean;
}

type ChkFlowEnvironment = {
    homePath: NodePath,
    activeNode: NodePath | null, 
    isLinking: boolean
}

type ChkFlowSettings = Partial<ChkFlowState>

type NodeId = string
type PathElem = {rel: string, id: NodeId}
type NodePath = [PathElem, ...PathElem[]] | [...PathElem[] | PathElem]

interface ComponentData {
    type: string;
    children?: ComponentData[];
    contents?: string;
}

type ChkFlowNodes = { 
    '0': ChkFlowNode, 
    [nodeId:string]: ChkFlowNode
}


interface ChkFlowNode extends BaseNodeInfo{
    rel: { 
        [key:string]: NodeId[]
    },
    data: { 
        [key:string]: any
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
    relKeys: NodeId[];
    relId: NodeId;
    isLinking: boolean;
    setIsLinking: (isLinking: boolean)=> void;
    linkNode: (nodePath: NodePath, nodeId: NodeId)=> void;
    setActiveNode: (path:NodePath) => void;
    updateNode: (path: NodePath, data: ChkFlowNode) => void;
    setPath: (path: NodePath) => void;
    newChildUnderThisNode: (path: NodePath) => void;
    getRelation: (path:NodePath) => NodeId;
    setRelation: (path:NodePath, rel:NodeId) => void;
    moveChildFromPath: (path:NodePath, newParent: NodeId) => void;
    moveUnderPreviousNode: (path:NodePath) => void;
    moveUnderGrandParentBelowParent: (path:NodePath) => void;
    toggleCollapse: (path:NodePath) => void;
    newChildUnderThisNode: (path:NodePath) => void;
    moveCursorToVisuallyNextNode: (path:NodePath) => void
    moveCursorToVisuallyPreviousNode: (path:NodePath) => void
    updatePathRel: (path:NodePath, rel:NodeId) => void
    getNodeLabel: (nodeId: NodeId) => string
}
// interface TreeNodeState<T extends BaseNodeInfo> {

// }

interface ContainerProps {
    environment: ChkFlowEnvironment;
    nodes: ChkFlowNodes;
    children: TreeNodeComponent[];
    path : NodePath;
    setPath: (path: NodePath) => void;
    resetNodes: () => void;
    getNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    getRelNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    setPath: (path: NodePath) => void;
    evaluateNode : (path: NodePath) => Either<any, Error>;
}



type TreeNodeComponent = React.FC<TreeNodeProps> | React.Component<TreeNodeProps>
type ContainerComponent<P extends ContainerProps> = React.FC<P> | React.Component<P>


interface DisplayNodeProps {
    nodeData: ChkFlowNode;
}



type ChkFlowNodeData = any;

export type {
    ChkFlowNodeData,
    DisplayNodeProps,
    ChkFlowState,
    ChkFlowSettings,
    ChkFlowEnvironment,
    ChkFlowNodes,
    ChkFlowNode,
    ComponentData,
    TreeNodeProps,
    ContainerProps,
    ContainerComponent,
    TreeNodeComponent,
    NodeId,
    PathElem,
    NodePath,
    BaseNodeInfo,
}