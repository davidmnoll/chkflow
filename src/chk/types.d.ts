import React from "react";


/**Initializer Components &  Props */

type ChkFlowSettings = {
    treeNodeComponent: TreeNodeComponent,
    treeHeadComponent: TreeHeadComponent,
    treeTailDisplayComponent: TreeTailDisplayComponent,
    treeTailEditComponent: TreeTailEditComponent,
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

type NodeId = string | number

type ChkFlowNodes<T extends BaseNodeInfo> = {
    [nodeId:NodeId]: T
}


interface BaseNodeInfo {
    nodeId: string,
    children: NodeId[],
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
    updateNode: (id: NodeId, data: T) => boolean;
}
// interface TreeNodeState<T extends BaseNodeInfo> {

// }
type TreeNodeState<T> = any

type DefaultTreeNodeProps = any
type DefaultTreeHeadProps = any
type DefaultTreeTailEditProps = any
type DefaultTreeTailDisplayProps = any

type TreeNodeComponent<T extends BaseNodeInfo> = React.FC<TreeNodeProps<T>> | React.Component<TreeNodeProps<T>>
type TreeHeadComponent = React.FC<TreeHeadProps> | React.Component<TreeHeadProps>
type TreeTailDisplayComponent = React.FC<TreeTailDisplayProps> | React.Component<TreeTailDisplayProps>
type TreeTailEditComponent = React.FC<TreeTailEditProps> | React.Component<TreeTailEditProps>


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
    TreeNodeProps,
    TreeNodeState,
    TreeNodeComponent,
    DefaultNodeInfo,
    NodeId,
    BaseNodeInfo,
    TreeNodeInterface,
    DefaultTreeNodeProps,
    DefaultTreeHeadProps,
    DefaultTreeTailEditProps,
    DefaultTreeTailDisplayProps,
}