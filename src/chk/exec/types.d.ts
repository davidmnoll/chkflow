import React from "react";
import { Types as ChkFlowTypes } from "./ChkFlow";
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
    activeNode: NodePath | null
}

type ChkFlowSettings = Partial<ChkFlowState>

type NodeId = string
type PathElem = {rel: string, id: NodeId}
type NodePath = [PathElem, ...PathElem[]]

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
}
// interface TreeNodeState<T extends BaseNodeInfo> {

// }


interface ExecTreeContainerProps extends ChkFlowTypes.ContainerProps {
    relKeys: NodeId[];
    environment: ChkFlowEnvironment;
    nodes: ChkFlowNodes;
    children: TreeNodeComponent[];
    path : NodePath;
    relId: NodeId;
    setPath: (path: NodePath) => void;
    updateNode: (path: NodePath, data: ChkFlowNode) => void;
    resetNodes: () => void;
    getNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    updatePathRel: (path:NodePath, rel:NodeId) => void
    getRelNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    evaluateNode : (path: NodePath) => Either<any, Error>;
    getNodeLabel: (nodeId: NodeId) => string
}

interface ExecWindowProps {
    relKeys: NodeId[];
    environment: ChkFlowEnvironment;
    relId: NodeId;
    nodePath : NodePath;
    updateNode: (path: NodePath, data: ChkFlowNode) => void;
    updatePathRel: (path:NodePath, rel:NodeId) => void
    getNodeLabel: (nodeId: NodeId) => string;
    setPath: (path: NodePath) => void;
    getNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    getRelNodeInfo: (path: NodePath) => Maybe<ChkFlowNode>;
    evaluateNode : (path: NodePath) => void;
    nodeInfo: ChkFlowNode;
}


type TreeNodeComponent = React.FC<TreeNodeProps> | React.Component<TreeNodeProps>
type ContainerComponent = React.FC<ContainerProps> | React.Component<ContainerProps>
type ExecWindowComponent = React.FC<ExecWindowProps> | React.Component<ExecWindowProps>


interface DisplayNodeProps {
    nodeData: ChkFlowNode;
}

interface RelInputProps {
    relKeys : NodeId[];
}

type ChkFlowNodeData = any;

interface NodeCheckboxProps {
    nodeData: ChkFlowNodeData;
    updateNodeData: (nodeData: ChkFlowNodeData) => void;
    relLabel: string;
    relId: NodeId;
    // relNode: ChkFlowNode;
}

export type {
    RelInputProps,
    ExecWindowProps,
    ExecTreeContainerProps,
    DisplayNodeProps,
    ChkFlowState,
    ChkFlowSettings,
    ChkFlowEnvironment,
    ChkFlowNodes,
    ChkFlowNode,
    ChkFlowNodeData,
    ComponentData,
    TreeNodeProps,
    NodeCheckboxProps,
    ContainerComponent,
    TreeNodeComponent,
    ExecWindowComponent,
    NodeId,
    PathElem,
    NodePath,
    BaseNodeInfo,
}