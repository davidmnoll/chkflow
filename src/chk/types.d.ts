import React from "react";


/**Initializer Components &  Props */

type ChkFlowSettings = {
    treeNodeComponent: TreeNodeComponent,
    treeHeadComponent: TreeHeadComponent,
    treeTailComponent: TreeTailEditComponent,
    defaultNodes: ChkFlowNodes,
    defaultEnvironment: ChkFlowEnvironment
}

interface ChkFlowBaseProps {
    environment: ChkFlowEnvironment,
    settings: ChkFlowSettings, 
    nodes: ChkFlowNodes
}

type ChkFlowProps = Partial<ChkFlowProps>

type ChkFlowState = any
// type ChkFlowState = {

// }



/** Node state */

type NodeId = string 

type ChkFlowNodes<T extends BaseNodeInfo> = {
    [nodeId:string]: T
}


interface BaseNodeInfo {
    nodeId: string,
    // children: NodeId[],
    rel: { 
        [key:string]: NodeId[] 
    }
    isCollapsed: boolean
}

interface DefaultNodeInfo extends BaseNodeInfo {
    text: string,
}


/**Display Components &  Props */

interface TreeNodeProps<T extends BaseNodeInfo> {
    nodePath: NodeId[NodeId];
    nodeInfo: T;
    settings: ChkFlowSettings;
    render: TreeNodeComponent;
    relation: NodeId;
    activeNode: NodeId[];
    setActiveNode: (path:NodeId[]) => void;
    updateNode: (path: NodeId[], data: T) => void;
    setPath: (path: NodeId[]) => void;
    getRelation: (path:NodeId[]) => NodeId;
    setRelation: (path:NodeId[], rel:NodeId) => void;
    newChild: (path:NodeId[]) => void;
    moveChildFromPath: (path:NodeId[], newParent: NodeId) => void;
    moveUnderPreviousNode: (path:NodeId[]) => void;
    moveUnderParent: (path:NodeId[]) => void;
    toggleCollapse: (path:NodeId[]) => void;
    newChildUnderThisNode: (path:NodeId[]) => void;
    moveCursorToVisuallyNextNode: (path:NodeId[]) => void
    moveCursorToVisuallyPreviousNode: (path:NodeId[]) => void
}
// interface TreeNodeState<T extends BaseNodeInfo> {

// }
type TreeNodeState<T> = any

type NodePath = [NodeId, ...NodeId[]]

type DefaultTreeNodeProps = any
type DefaultTreeHeadProps = any
type DefaultTreeTailProps = any

type TreeNodeComponent<T extends BaseNodeInfo> = React.FC<TreeNodeProps<T>> | React.Component<TreeNodeProps<T>>
type TreeHeadComponent = React.FC<TreeHeadProps> | React.Component<TreeHeadProps>
type TreeTailComponent = React.FC<TreeTailProps> | React.Component<TreeTailProps>


interface TreeNodeInterface {

}

/** Extras */

class Nothing {
    empty: boolean = true;
}


class Just<T> {
    constructor(content: T){
        this.content = content;
    }
    empty: boolean = false;
}

type Maybe<T> = Just<T> | Nothing;




export {
    Maybe,
    Just,
    Nothing,
    ChkFlowProps,
    ChkFlowBaseProps,
    ChkFlowState,
    ChkFlowNodes,
    TreeNodeProps,
    TreeNodeState,
    TreeNodeComponent,
    DefaultNodeInfo,
    NodeId,
    NodePath,
    BaseNodeInfo,
    TreeNodeInterface,
    DefaultTreeNodeProps,
    DefaultTreeHeadProps,
    DefaultTreeTailProps,
}